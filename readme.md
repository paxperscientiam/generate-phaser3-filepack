[Phaser 3](https://github.com/photonstorm/phaser) Pack File Generator
---

This script generates a File Pack in JSON form according to the [framework definition](https://newdocs.phaser.io/docs/3.60.0/focus/Phaser.Loader.LoaderPlugin-pack).

## Features
Generates a Pack File based on organization of asset files, using a configuration file to shape output.


## Usage
This script requires a configuration file following the following structure:
```json
{
  "extensions?": string // optional comma-separated list of allowed file extensions, default action is not to filter by extension
  "targets": [
    {
      "hint"?: ["audio"|"image"|"bitmapFont"] // optionally assert asset type
      "key": string // unique key to describe set of targeted files
      "basePath": string // which directory to search
      "extensions": string // comma separated list of allowed file extensions, takes precedence over higher-level definition
    },
    {
     // additional targets
    }
   ]
}
```

For assets that are not automatically inferred, you'll probably want to take advantage of hint options.

### Invocation:
```shell
npx  @paxperscientiam/generate-phaser3-filepack <configfile.json>

```



## Notes
- this script does NOT write anything to file; it's up to you to do so.


### Auto inferred types
- [x] image
- [x] audio
- [ ] binary
- [ ] css
- [ ] html
- [ ] json
- [ ] svg
- [ ] txt



## Contributors
- All the programmers Copilot ripped off
- Fine folks at liberachat
- Phaser community
