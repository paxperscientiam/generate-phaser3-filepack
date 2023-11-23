// key should be: {subject}{filename-without-ext}
// when is it ok for keys to repeat?
// figure out how to college the two assets for bitmap font (xml + image)
// collect URLs when type=audio and key are same
// allow override of allowed extensions
// option to ignore certain subdirectories of AssetTarget.basePath

import dirTree, { DirectoryTree } from "directory-tree"
import fs from 'fs'

import type  {
    FilePack, IConfigAssetTarget, IPhaserFilePackAsset, IPhaserFilePackFiles
} from "index.d"

import {
    iConfigSchema,
} from "index.zod"

import { guessWhichProcessor, proxyHandler } from "processors"
import { isCollapsibleType } from "filetype-check"

type DirTreeRecord = DirectoryTree<Record<string,any>>
type DirTreeRecordTweak = DirTreeRecord & {
    key: string
}

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

const files: string[] = []

// copilot assisted function
function collapseArraySubset(arr: IPhaserFilePackAsset[]) {
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
                map.set(key, { ...obj, [obj.focalKey]: [obj[obj.focalKey as keyof IPhaserFilePackAsset]] });
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
function buildIt(target: IConfigAssetTarget, re: RegExp|undefined) {
    let reFinal = re
    if ("string" === typeof target.extensions) {
        reFinal = str2re(target.extensions)
    }

    const ignoredPaths: RegExp|RegExp[] = [
        /\.DS_Store/i,
        /\.Thumbs.db/i
    ]

    if (Array.isArray(global.configData?.ignoredPaths)) {
        global.configData.ignoredPaths.forEach(item => ignoredPaths.push(new RegExp(item)))
    }
    
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
            if (files.includes(item.path)) return
            Object.assign(item, {isDirty: true})
            files.push(item.path)

            if (target.hint) {
                proxyHandler(item as unknown as DirTreeRecordTweak, target, target.hint)
            } else {
                guessWhichProcessor(item as unknown as DirTreeRecordTweak, target)
            }

            if (!filePack.hasOwnProperty(target.key)) {
                Object.assign(filePack, {
                    [target.key]: {
                        files: []
                    }
                })
            }

            if ("unknown" === item.type as unknown as string) {
                filePack.unknowns.push(item.path)
                return
            }

            Reflect.get(filePack, target.key).files.push(item as unknown as IPhaserFilePackAsset)
        })
}

// add some metadata to final product
Object.assign<FilePack, any>(filePack, {
    meta: {
        "generated": Date.now()
    },
    unknowns: []
})

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

for (const [_filePackKey, fileSet] of Object.entries<IPhaserFilePackFiles>(filePack)) {
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

// clean
for (const [_filePackKey, fileSet] of Object.entries<IPhaserFilePackFiles>(filePack)) {
    fileSet?.files?.forEach(file => {
        delete file.isDirty
        delete file.focalKey
    })
}

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

