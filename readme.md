[Phaser 3](https://github.com/photonstorm/phaser) Pack File Generator
---

## WARNING
This is still a work in progress. Until complete, it will not write a file; however, you can pipe the output to a file. Contributions welcome!



This script generates a File Pack in JSON form according to the [framework definition](https://newdocs.phaser.io/docs/3.60.0/focus/Phaser.Loader.LoaderPlugin-pack).

## Features
Generates a Pack File based on organization of asset files, using a configuration file to shape output.


## Usage
This script requires a configuration file following the following structure:
```json
{
  "extensions"?: string // optional comma-separated list of allowed file extensions, default action is not to filter by extension
  "options":? {
    "keyFormat"?: "namespaced"|"filebasename" 
  },
  "targets": [
    {
      "key": string // unique key to describe set of targeted files
      "basePath": string // which directory to search
      "hint"?: ["audio"|"image"|"bitmapFont"] // optionally assert asset type
      "extensions"?: string // comma separated list of allowed file extensions, takes precedence over higher-level definition
      "ignoredPaths"?: RegExp|RegExp[]
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

If you set a "hint", it's assumed accurate. 



### Auto inferred types
- [ ] atlas
- [ ] atlasXML
- [ ] audioSprite
- [ ] htmlTexture
- [ ] multiatlas
- [ ] obj
- [ ] spritesheet
- [ ] tilemapCSV
- [ ] tilemapImpact
- [ ] tilemapTiledJSON
- [ ] unityAtlas
- [x] audio (:IPhaserFilePackGenericAsset)
- [x] binary (:IPhaserFilePackBinaryAsset)
- [x] css
- [x] glsl
- [x] html
- [x] image (:IPhaserFilePackGenericAsset)
- [x] json
- [x] svg
- [x] text
- [x] video
- [x] xml


### Hint-reliant types
- [x] atlas
- [x] bitmapFont


### Improvements
- [ ] add mode to merge new with pre-existing 
- [ ] add check to prevent changing keys of unmoved files
- [x] filter out commonsystem and temp files. EG .DS_Store 
- [ ] post process adjustments.
  - [ ] allow set `asBlob` and `noAudio` in post-processing.
- [ ] use phaser's type for development testing


### Bugs
- [x] only selectively collapse asset set (EG: collapse audio, but not toher types with files with same file-basenames)
- [ ] filter out unknowns explicitly
- [ ] review warnings about key uniqueness. EG [this on videos](https://newdocs.phaser.io/docs/3.54.0/Phaser.Loader.LoaderPlugin#video).



## Contributors
- All the programmers Copilot ripped off
- Fine folks at liberachat
- Phaser community
