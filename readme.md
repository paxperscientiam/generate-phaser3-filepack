[Phaser 3](https://github.com/photonstorm/phaser) Pack File Generator
---

## WARNING
This is still a work in progress. Until complete, it will not write a file; however, you can pipe the output to a file.



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
This script does NOT write anything to file; it's up to you to do so.

Is you set a "hint", it's assumed accurate.



### Auto inferred types
- [ ] atlas
- [ ] atlasXML
- [ ] audioSprite
- [ ] binary
- [ ] bitmapFont
- [ ] glsl
- [ ] html
- [ ] htmlTexture
- [ ] json
- [ ] multiatlas
- [ ] obj
- [ ] spritesheet
- [ ] svg
- [ ] tilemapCSV
- [ ] tilemapImpact
- [ ] tilemapTiledJSON
- [ ] unityAtlas
- [ ] video
- [ ] xml
- [x] audio (:IPhaserFilePackGenericAsset)
- [x] binary (:IPhaserFilePackBinaryAsset)
- [x] css
- [x] image (:IPhaserFilePackGenericAsset)
- [x] text



### Various checks
- [ ] add check to prevent changing keys of unmoved files
- [ ] filter out commonsystem and temp files. EG .DS_Store 

### Fixes
- [ ] only selectively collapse asset set (EG: collapse sounds, but not toher types with files with same file-basenames)

## Contributors
- All the programmers Copilot ripped off
- Fine folks at liberachat
- Phaser community
