# Monster Art Pack

Generated monster portraits for Echoes of Zodar live here.

Filename convention:

```text
<monster-id>-<monster-name-slug>.png
```

Example:

```text
m1-goblin-delle-rovine.png
```

Use `npm run monster:prompts` to rebuild `monster-image-prompts.json` from
`src/data/monstersData.js`. The manifest contains one production prompt per
monster plus the final public path expected by the app.
