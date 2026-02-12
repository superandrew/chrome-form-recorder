# Session State Snapshot (2026-02-12)

## Git Base
- Branch: `develop`
- Base commit: `9ccec99`
- Working tree: dirty (uncommitted changes)

## Uncommitted Files
- `background.js`
- `content.js`
- `manifest.json`
- `popup.html`
- `popup.js`
- `styles.css`

## Build Markers
- Extension version: `1.2` (`manifest.json`)
- Content script build id: `2026-02-12.3` (`content.js`)

## Snapshot Artifact
- Full patch of all current uncommitted edits:
  - `SESSION_PATCH_2026-02-12.diff`

## Functional State Implemented
- Improved SPA element matching and replay fallbacks.
- Verbose replay logging toggle in popup.
- Smart wait mode + configurable action timeout.
- Replay normalization (drop noisy input-field pointerdowns, collapse consecutive inputs).
- Top-frame guard to avoid duplicate replay from iframe injections.
- Dynamic ID fallback for SAP/UI5-like selectors (`__xmlview...`, `...-BDI-content`).
- Build-info ping from popup to content script (`vX.Y • c:BUILD`).
- Recording reliability fixes:
  - flush pending debounced input on stop,
  - stop flow waits before reading actions,
  - background addAction path uses in-memory authoritative state to reduce storage race loss.

## Restore Later
If your working tree is clean and you want to restore this exact snapshot:

```bash
git checkout develop
git reset --hard 9ccec99
git apply --index SESSION_PATCH_2026-02-12.diff
```

If you only want to re-apply without staging:

```bash
git apply SESSION_PATCH_2026-02-12.diff
```

## Quick Verification After Restore
1. Load unpacked extension from this repo.
2. Open popup: version should show `v1.2`.
3. On normal `https://` page, popup build line should include `c:2026-02-12.3`.
