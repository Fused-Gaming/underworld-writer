# Asset Licensing

## underworld-writer-icon.svg

**Source**: [SVG Repo](https://www.svgrepo.com)  
**License**: Free for commercial and personal use  
**Attribution**: SVG Repo community  
**Usage**: Package icon, documentation, UI elements

### License Terms
This SVG asset is provided under an open license allowing:
- ✅ Commercial use
- ✅ Personal use
- ✅ Distribution
- ✅ Modification

### Cleanroom Sandbox Notice
This asset should be processed through @h4shed/cleanroom for:
- License verification
- Source attribution validation
- Content safety scanning
- Compliance with distribution policies

### Implementation
When using this asset in distribution or publication:

```typescript
import { CleanroomSandbox } from '@h4shed/cleanroom';

const cleanroom = new CleanroomSandbox();
const validatedAsset = await cleanroom.validateAsset({
  path: 'assets/underworld-writer-icon.svg',
  license: 'svgrepo-free',
  attribution: 'SVG Repo community',
  usage: 'package-icon',
});
```

### Attribution Required
When redistributing this package, include:
> Icon: Underworld Writer by SVG Repo (https://www.svgrepo.com)
