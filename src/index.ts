// key should be: {subject}{filename-without-ext}
// when is it ok for keys to repeat?
// figure out how to college the two assets for bitmap font (xml + image)
// collect URLs when type=audio and key are same
// allow override of allowed extensions
// option to ignore certain subdirectories of AssetTarget.basePath

// support multiple targets!

import dirTree from "directory-tree"
import fs from 'fs'
import path from 'path'
import isImage from 'is-image'

import type  {
    FilePack
} from "index.d"

import {
    iConfigSchema,
    iConfigAssetTargetSchema,
    iPhaserFilePackAssetSchema,
    iPhaserFilePackFilesSchema
} from "index.zod"

import { z } from "zod"

type IConfig = z.infer<typeof iConfigSchema>
type IAssetTarget = z.infer<typeof iConfigAssetTargetSchema>
type IFilePackTarget = z.infer<typeof iPhaserFilePackAssetSchema>
type IMetaFilePack = z.infer<typeof iPhaserFilePackFilesSchema>

const args = process.argv

if (2 === args.length) {
    console.error("Must specify a configuration file!")
    process.exit(1)
}

const configFile = args[2]

let configData: IConfig

try {
    const buffer = fs.readFileSync(configFile, {})
    configData = JSON.parse(buffer.toString())
    iConfigSchema.parse(configData)
} catch (e) {
    console.error(e)
    process.exit(1)
}

const targets = configData.targets

if (!Array.isArray(configData.targets) || 0 === configData.targets.length) {
    console.error("Must specify at least one target per definition!")
    process.exit(1)
}

let defaultRegex: RegExp|undefined


function str2re(restring: string): RegExp {
    const exts = restring.split(",")
    return new RegExp('\\.(' + exts.join('|') + ')$')
}

if (null == configData.extensions) {
    defaultRegex = undefined
} else {
    defaultRegex = str2re(configData.extensions)
}

function isCSS(filepath: string) {
    const ext = path.parse(filepath).ext.replace(/^\./, '')
    return "css" === ext
}

function isAudio(filepath: string) {
    const ext = path.parse(filepath).ext.replace(/^\./, '')
    return [
        "aac",
        "aiff",
        "ape",
        "au",
        "flac",
        "gsm",
        "it",
        "m3u",
        "m4a",
        "mid",
        "mod",
        "mp3",
        "mpa",
        "ogg",
        "pls",
        "ra",
        "s3m",
        "sid",
        "wav",
        "wma",
        "xm",
    ].includes(ext)
}

function isXML(filepath:string) {
    return 'xml' == path.parse(filepath).ext.replace(/^\./, '')
}

const filePack = {
} as FilePack


// copilot assisted
function collapseArraySubset(arr: IFilePackTarget[]) {
    const result = [];
    const map = new Map();

    for (const obj of arr) {
        const key = obj.key + obj.type;
        if (map.has(key)) {
            const existingObj = map.get(key);
            existingObj.url.push(obj.url);
        } else {
            map.set(key, { ...obj, url: [obj.url] });
        }
    }

    for (const obj of map.values()) {
        result.push(obj);
    }

    return result;

}

// function getRedundantKey(arr) {
//     const original = []
//     const duplicates = []

//     arr.forEach((item, index) => {
//         if (original.includes(item)) {
//             duplicates.push(item)
//         } else {
//             original.push(item)
//         }
//     })
//     return duplicates
// }

function buildIt(target: IAssetTarget, re: RegExp) {
    let reFinal = re
    if ("string" === typeof target.extensions) {
        reFinal = str2re(target.extensions)
    }

    const ignoredPaths: RegExp|RegExp[] = []

    if (Array.isArray(target.ignoredPaths)) {
        target.ignoredPaths.forEach(item => ignoredPaths.push(new RegExp(item)))
    }
    if ("string" === typeof target.ignoredPaths) {
        ignoredPaths.push(new RegExp((target.ignoredPaths)))
    }

    return dirTree(
        `${target.basePath}`,
        {
            extensions: reFinal,
            exclude: ignoredPaths

        },
        (item, PATH) => {
            const fileparts = path.parse(PATH)
            const ns = path.basename(target.basePath)

            const key = `${ns}/${fileparts.name}`


            Object.assign(item, {key})

            // @ts-ignore
            delete item.name
            // console.llog(item.name)

            if (null != target.hint) {
                Object.assign(item, {type: target.hint})
            } else if (isImage(PATH)) {
                Object.assign(item, {type:"image"})
            } else if (isAudio(PATH)) {
                Object.assign(item, {type: "audio"})
            } else if (isCSS(PATH)) {
                Object.assign(item, {type: "css"})
            } else {
                Object.assign(item, {type: "unknown"})
            }


            // @ts-ignore
            if ("bitmapFont" == item.type) {
                if (isXML(PATH)) {
                    Object.assign(item, {fontDataURL: item.path})
                }               // 17
                if (isImage(PATH)) {
                    Object.assign(item, {textureURL: item.path})
                }
            } else {
                Object.assign(item, {url: item.path})
            }

            // might need to keep item.path
            // @ts-ignore
            delete item.path

            if (!filePack.hasOwnProperty(target.key)) {
                Object.assign(filePack, {
                    [target.key]: {
                        files: []
                    }
                })
            }
            Reflect.get(filePack, target.key).files.push(item)
        }
    )
}

targets.forEach(target => {
    try {
        if (!fs.existsSync(target.basePath)) {
            throw `The target directory does not exist: ${target.basePath}`
        }
        buildIt(target, defaultRegex)
    } catch (err) {
        console.error(err);
        process.exit(1)
    }
})

Object.assign<FilePack, any>(filePack, {
    meta: {
        "generated": Date.now()
    }
})


// function hasDuplicateAssetKey(arr) {
//     const l1 = arr.length
//     const dedupedArray = Array.from(new Set(arr))
//     return l1 !== dedupedArray.length
// }

// @ts-ignore
for (const [_k, v] of Object.entries<IMetaFilePack>(filePack)) {
    if (null == v.files) continue

    Object.assign(v, {
        files: collapseArraySubset(v.files)
    })
}                               // 9

// for (const [k, v] of Object.entries(filePack)) {
//     if (null == v.files) continue

//     const paths_of_possibly_redundant_keys = []
//     const files_of_possibly_redundant_keys = []
//     const kk = v.files.map(item => {
//         paths_of_possibly_redundant_keys.push(item.path)
//         files_of_possibly_redundant_keys.push(item.key)
//         // delete item.name
//         // delete item.path
//         return item.key
//     })

//     if (true === hasDuplicateAssetKey(kk)) {
//         console.group(`> Warning`)
//         console.warn(`The asset set "${k}" contains duplicate keys!`)
//         console.warn(paths_of_possibly_redundant_keys)
//         console.warn(files_of_possibly_redundant_keys)
//         console.warn(getRedundantKey(kk), ["Examine these:", paths_of_possibly_redundant_keys.filter(item => item.includes(files_of_possibly_redundant_keys[0]))])
//         console.groupEnd()
//     }
// }

console.log(JSON.stringify(filePack, null, 2))

