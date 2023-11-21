[Phaser 3](https://github.com/photonstorm/phaser) Pack File Generator
------

## WARNING
This project is still a work in progress. I have intentionally designed this script to not write a file. Users can produce a file through output re-direction.


## What is this?
This script serves Phaser 3 developers who manage their assets with Phaser's PackFile loader. It's meant to take the load off of manually maintaining a PackFile, which becomes tedious once one is dealing with lots of assets. The product of this script is meant to adhere to the form defined in [framework definition](https://newdocs.phaser.io/docs/3.60.0/focus/Phaser.Loader.LoaderPlugin-pack).


## Features
Generates a Pack File based on organization of asset files, using a configuration file to shape output.


## Usage
This script requires a configuration file following the following structure:
```json
{
  "extensions"?: string // optional comma-separated list of allowed file extensions, default action is not to filter by extension
  "options":? {
    "keyFormat"?: "namespaced"|"filebasename" ,
    "outputDuplicateKeyWarning"?: boolean
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

This script processes targets sequentially. What this means is that files found in the first target folder will not be processed a second time, even if included in the second target. This prevents double-processing, which is useful if higher-ranked target is type-hinted.


For assets that are not automatically inferred, you'll probably want to take advantage of hint options.

### Invocation:
```shell
npx  @paxperscientiam/generate-phaser3-filepack <configfile.json>

```
Example of invocation and saving (careful not overwrite unintentionally):
```shell
npx  @paxperscientiam/generate-phaser3-filepack config.json > filepack.json

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
- [ ] allow set `asBlob` and `noAudio` in post-processing.
- [ ] add check to prevent changing keys of unmoved files
- [ ] add mode to merge new with pre-existing 
- [ ] isolate unknow file types
- [ ] post process adjustments.
- [ ] use phaser's types for development
- [ ] idempotence
- [x] avoid double processing. This can be done with combination of dirty flags and collative full file list. Or, maybe make a dictionary of all paths, using dirTree in a prior step for that purpose
- [x] filter out commonsystem and temp files. EG .DS_Store 


### Bugs
- [x] only selectively collapse asset set (EG: collapse audio, but not toher types with files with same file-basenames)
- [ ] filter out unknowns explicitly
- [ ] review warnings about key uniqueness. EG [this on videos](https://newdocs.phaser.io/docs/3.54.0/Phaser.Loader.LoaderPlugin#video).



## Contributors
- All the programmers Copilot ripped off
- Fine folks at liberachat
- Phaser community
