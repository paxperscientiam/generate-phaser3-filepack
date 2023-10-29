// key should be: {subject}{filename-without-ext}
// when is it ok for keys to repeat?
// figure out how to college the two assets for bitmap font (xml + image)
// collect URLs when type=audio and key are same
//

// support multiple targets!

import dirTree from "directory-tree"
import fs from 'fs'
import path from 'path'
import isImage from 'is-image'

import {
    iConfigSchema,
    assetTargetSchema
} from "index.zod"
import { z } from "zod"

type IConfig = z.infer<typeof iConfigSchema>
type IAssetTarget = z.infer<typeof assetTargetSchema>

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
    console.log(configData)
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

let regex: RegExp


if (null == configData.extensions) {
    regex = new RegExp('/\./')
} else {
    const exts = configData.extensions.split(",")
    regex = new RegExp('\\.(' + exts.join('|') + ')$')
}

function isAudio(filepath: stringM) {
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
}

// copilot assisted
function collapseArraySubset(arr) {
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

function getRedundantKey(arr) {
    const original = []
    const duplicates = []

    arr.forEach((item, index) => {
        if (original.includes(item)) {
            duplicates.push(item)
        } else {
            original.push(item)
        }
    })
    return duplicates
}

function buildIt(target: IAssetTarget) {
    dirTree(
        `${target.basePath}`,
        {
            extensions: regex
        },
        (item, PATH) => {
            const fileparts = path.parse(PATH)
            const ns = path.basename(target.basePath)

            const key = `${ns}/${fileparts.name}`
            

            Object.assign(item, {key})

            delete item.name
            // console.llog(item.name)

            if (null != target.hint) {
                Object.assign(item, {type: target.hint})
            } else if (isImage(PATH)) {
                Object.assign(item, {type:"image"})
            } else if (isAudio(PATH)) {
                Object.assign(item, {type: "audio"})
            } else {
                Object.assign(item, {type: "unknown"})
            }

            if ("bitmapFont" == item.type) {
                if (isXML(PATH)) {
                    Object.assign(item, {fontDataURL: item.path})
                }
                if (isImage(PATH)) {
                    Object.assign(item, {textureURL: item.path})
                }
            } else {
                Object.assign(item, {url: item.path})
            }

            // might need to keep item.path
            delete item.path

            if (!filePack.hasOwnProperty(target.key)) {
                filePack[target.key] = {
                    files: []
                }
            }

            filePack[target.key].files.push(item)
        }
    )
}

targets.forEach(target => {
    try {
        if (!fs.existsSync(target.basePath)) {
            throw `The target directory does not exist: ${target.basePath}`
        }

        buildIt(target)
    } catch (err) {
        console.error(err);
        process.exit(1)
    }
})

Object.assign(filePack, {
    meta: {
        "generated": Date.now()
    }
})

function hasDuplicateAssetKey(arr) {
    const l1 = arr.length
    const dedupedArray = Array.from(new Set(arr))
    return l1 !== dedupedArray.length
}

for (const [k, v] of Object.entries(filePack)) {
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
