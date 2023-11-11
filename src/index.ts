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

import type  {
    FilePack, IPhaserFilePackAsset
} from "index.d"

import {
    iConfigSchema,
    iConfigAssetTargetSchema,
    iPhaserFilePackGenericAssetSchema,
    iPhaserFilePackFilesSchema
} from "index.zod"

import { z } from "zod"
import { guessWhichProcessor, proxyHandler } from "processors"
import { isCollapsibleType } from "filetype-check"

type IConfig = z.infer<typeof iConfigSchema>
    type IAssetTarget = z.infer<typeof iConfigAssetTargetSchema>
    type IFilePackTarget = z.infer<typeof iPhaserFilePackGenericAssetSchema>
    type IMetaFilePack = z.infer<typeof iPhaserFilePackFilesSchema>

    const args = process.argv

if (2 === args.length) {
    console.error("Must specify a configuration file!")
    process.exit(1)
}

const configFile = args[2]

try {
    const buffer = fs.readFileSync(configFile, {})
    global.configData = JSON.parse(buffer.toString())
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


const filePack = {
} as FilePack


// copilot assisted function
function collapseArraySubset(arr: IFilePackTarget[]) {
    const result = [];
    const map = new Map();
    for (const obj of arr) {
        const key = obj.key + obj.type;
        if (map.has(key)) {
            const existingObj = map.get(key);
            if (obj?.focalKey) {
                existingObj[obj.focalKey].push(Reflect.get(obj, obj.focalKey))
            } else {
                map.set(key, {...obj, ...existingObj})
            }
        } else {
            if (obj?.focalKey) {
                map.set(key, { ...obj, [obj.focalKey]: [obj[obj.focalKey]] });
            } else {
                map.set(key, { ...obj});
            }
        }
    }

    for (const obj of map.values()) {
        result.push(obj);
    }
    return result;
}



// represent filesystem structure in JS object
function buildIt(target: IAssetTarget, re: RegExp|undefined) {
    let reFinal = re
    if ("string" === typeof target.extensions) {
        reFinal = str2re(target.extensions)
    }

    const ignoredPaths: RegExp|RegExp[] = [
        /\.DS_Store/i,
        /\.Thumbs.db/i
    ]

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
        (item, _PATH) => {
//            console.log(target)
            if (target.hint) {
                proxyHandler(item, target, target.hint)
            } else {
                guessWhichProcessor(item, target)
            }

            if (!filePack.hasOwnProperty(target.key)) {
                Object.assign(filePack, {
                    [target.key]: {
                        files: []
                    }
                })
            }

            Reflect.get(filePack, target.key).files.push(item as unknown as IPhaserFilePackAsset)
        })
}


targets.forEach(target => {
    try {
        if (!fs.existsSync(target.basePath)) {
            throw `This target directory does not exist: "${target.basePath}". Correct this, then try again.`
        }
        buildIt(target, defaultRegex)
    } catch (err) {
        console.error(err);
        process.exit(1)
    }
})

// add some metadata to final product
Object.assign<FilePack, any>(filePack, {
    meta: {
        "generated": Date.now()
    }
})


// @ts-ignore
for (const [_filePackKey, fileSet] of Object.entries<IMetaFilePack>(filePack)) {
    if (null == fileSet.files) continue

    const is_collapsible = fileSet.files.some(file => {
        return null != file.type && isCollapsibleType(file.type)
    })

    if (true === is_collapsible) {
        Object.assign(fileSet, {
            files: collapseArraySubset(fileSet.files)
        })
        continue
    }

    Object.assign(fileSet, {
        files: fileSet.files
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

