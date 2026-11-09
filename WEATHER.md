# Home weather support

This source update uses the typed `weather-v1` capability in Clean Your TV Home.
Home owns data fetching, location consent, settings, placement and remote navigation.
The theme declares allowed formats, scale, padding and a bundled icon style; its
CSS styles only approved weather parts. No author JavaScript or external weather
provider is embedded. Older Home rejects this new capability safely; keep existing
published theme packages for older Home installations.

This is a candidate source update paired with the Home weather integration.
Browser evidence does not establish TV compatibility. Build with the updated
main-project compiler/runtime; do not rebuild against an older exported runtime.

Maintainer integration work is being prepared in a temporary catalog fork. The
upstream-compatible source branch retains the original theme identity, author and
license. Its separate maintainer-distribution branch uses a fork identity so
provenance is explicit. Authors can merge the source changes and continue
publishing under their own identity.
