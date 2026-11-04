# Atmosphere theme

A quiet landscape and horizontal app dock for [Clean Your TV on LG webOS](https://github.com/Razdva122/clean-your-tv-lg-webos). The original Atmosphere wallpaper, cool white clock and dark blue panels leave the scenery prominent. Home navigation, app management and recovery remain supplied by the launcher.

![Atmosphere browser preview with example apps](assets/preview.jpg)

This is the standalone theme source. It is prepared for the prospective public repository `luigy-lemon/atmosphere-theme`; that repository and a community listing have not been published by this local build. It is compatible with Home's theme engine **1.7.0 or newer** and requires `ribbon-layout-v1` support. It is not an Android TV theme.

## Build

Use Node.js 22 or newer, Git and a trusted checkout of Clean Your TV webOS **v1.7.1** or a descendant. Install that checkout's locked build dependencies once with `npm ci --ignore-scripts --no-audit --no-fund`. This theme adds no dependencies.

From this repository, after committing your edits:

```sh
npm run build -- --runtime ../cleanyourtv-webos
```

The build checks runtime Git ancestry, rejects uncommitted source changes, requires every consumed input to match the actual source commit, rejects escaping paths and symlinks, and verifies the compiled package with the launcher's own theme verifier. Ignored or untracked assets cannot enter the package. Rebuilding the same source with the same runtime produces identical bytes. Use a trusted runtime: the build executes its compiler on this computer.

Generated `dist/` is ignored by Git. It contains:

- `cytv-theme.json`, `rules.json`, images and license/credits documents: the theme distribution.
- `atmosphere.theme.json`: the local-transfer envelope accepted by the launcher's theme receiver.

The build keeps the previous output if validation fails. It does not pair with a TV, install anything, change TV state or publish files.

## Install and share

Use Clean Your TV's author toolkit to send a compiled local theme through **Settings → Themes → Receive from computer**, then apply it on the TV. Follow the upstream [theme guide](https://github.com/Razdva122/clean-your-tv-lg-webos/blob/main/docs/THEMES.md) for the current toolkit and transfer workflow. Select **Classic** in Themes to restore the launcher's original appearance.

For a public installation link, first publish the committed source in the repository named by the theme ID. Commit a verified distribution in a versioned directory and use its exact distribution commit in the raw GitHub descriptor URL. The descriptor's source commit must remain the committed source used to build it. A moving branch URL or private repository cannot be installed through the public theme catalogue.

Request community inclusion through the upstream [theme suggestion form](https://github.com/Razdva122/clean-your-tv-lg-webos/issues/new?template=theme-submission.yml), supplying the public source/package URL and license/asset credits. Submission is reviewed by the maintainers; a local build does not create a listing. Share only the theme files and synthetic browser preview, excluding device profiles, app inventories, pairing material and private TV screenshots.

## Checks

```sh
CYTV_RUNTIME=../cleanyourtv-webos npm test
```

The self-check uses an isolated copy of the committed source to test deterministic output, package verification, committed provenance, ignored-input and dirty-source rejection, and path/symlink rejection. It never contacts a TV. The preview uses example apps and simulated TV functions; it does not establish compatibility of every device or firmware.

See [LICENSE.txt](LICENSE.txt) and [CREDITS.txt](CREDITS.txt) for styling, wallpaper and preview attribution.
