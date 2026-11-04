#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

const root = __dirname;
const baseline = 'e44c056dbdd8619525fdb90a69a53bddb034130f';
const repository = 'https://github.com/luigy-lemon/atmosphere-theme';
function git(directory, ...args) {
  return execFileSync('git', ['-C', directory, ...args], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).trim();
}
async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--runtime' || !args[1]) throw Error('Usage: npm run build -- --runtime /path/to/cleanyourtv-webos');
  const runtime = fs.realpathSync(args[1]);
  try { git(runtime, 'merge-base', '--is-ancestor', baseline, 'HEAD'); }
  catch { throw Error('Runtime must descend from Clean Your TV webOS v1.7.1 (' + baseline + ')'); }
  if (git(root, 'status', '--porcelain')) throw Error('Commit source changes before building; generated dist/ is ignored.');
  const commit = git(root, 'rev-parse', 'HEAD');
  const {readLocal} = require(path.join(runtime, 'scripts/check-theme-submissions.cjs'));
  const {compileSource} = require(path.join(runtime, 'theme-api/compile.cjs'));
  const data = require(path.join(runtime, 'launcher/theme-data.js'));
  const manifest = JSON.parse(readLocal(root, 'theme.json', 65536));
  const result = await compileSource({
    manifest,
    css: readLocal(root, 'theme.css', 131072).toString('utf8'),
    source: {repository, commit},
    minimumHomeVersion: '1.7.0',
    assets: manifest.assets.map(asset => ({...asset, data: readLocal(root, asset.path, 2097152)})),
    documents: [...new Set([manifest.license.textPath, manifest.license.creditsPath])].map(name => ({path: name, data: readLocal(root, name, 32768)}))
  });
  const descriptor = Buffer.from(JSON.stringify(result.manifest) + '\n');
  const files = [{path: result.manifest.rules.path, data: Buffer.from(JSON.stringify(result.rules) + '\n')}, ...result.assets, ...result.documents];
  const envelope = {schemaVersion: 1, descriptor: descriptor.toString('base64'), files: {}};
  for (const file of files) envelope.files[file.path] = Buffer.from(file.data).toString('base64');
  data.verify(data.unpackEnvelope(envelope, '1.7.0'), '1.7.0');

  const stage = fs.mkdtempSync(path.join(root, '.dist-build-'));
  const output = path.join(root, 'dist');
  const previous = path.join(stage, 'previous');
  let published = false;
  try {
    for (const file of files.concat([{path: 'cytv-theme.json', data: descriptor}, {path: 'atmosphere.theme.json', data: JSON.stringify(envelope)}])) {
      const target = path.join(stage, 'package', file.path);
      fs.mkdirSync(path.dirname(target), {recursive: true});
      fs.writeFileSync(target, file.data);
    }
    if (fs.existsSync(output)) {
      if (!fs.lstatSync(output).isDirectory() || fs.lstatSync(output).isSymbolicLink()) throw Error('dist must be a generated directory, not a file or symlink');
      fs.renameSync(output, previous);
    }
    try { fs.renameSync(path.join(stage, 'package'), output); }
    catch (error) { if (fs.existsSync(previous)) fs.renameSync(previous, output); throw error; }
    published = true;
    console.log('Built Atmosphere ' + result.manifest.themeVersion + ' from ' + commit + ' into dist/');
  } finally {
    // Preserve the previous package if even the recovery rename fails.
    if (published || !fs.existsSync(previous)) fs.rmSync(stage, {recursive: true, force: true});
    else console.error('Previous distribution retained at ' + previous);
  }
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
