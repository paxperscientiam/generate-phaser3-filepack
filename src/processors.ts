import { DirectoryTree } from "directory-tree"
import { isAudio, isText, isXML, mapExtensionToType } from "filetype-check"
import { IConfigAssetTarget } from "index.d"
import isImage from "is-image"
import path from "path"

type DirTreeRecord = DirectoryTree<Record<string,any>>

function genericProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    const fileparts = path.parse(item.path)
    const ns = path.basename(target.basePath)

    const key = `${ns}/${fileparts.name}`
    Object.assign(item, {key})
    // @ts-ignore
    delete item.name

    return item
}

export function textProcessor(item: DirTreeRecord, target: IConfigAssetTarget): DirTreeRecord {
    genericProcessor(item, target)
    Object.assign(item, {type: "text"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

export function cssProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "css"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

function imageProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "image"})
}

export function noopProcessor(item: DirTreeRecord): DirTreeRecord {
    Object.assign(item, {type: "unknown"})
    return item
}

function audioProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "audio"})
    Object.assign(item, {url: item.path})
    Object.assign(item, {focalKey: "url"})
    // @ts-ignore
    delete item.path
    return item
}

function bitmapFontProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "bitmapFont"})

    if (isXML(item.path)) {
        console.log('bmfxml')
        Object.assign(item, {fontDataURL: item.path})
    }

    if (isImage(item.path)) {
        Object.assign(item, {textureURL: item.path})
    }

    // @ts-ignore
    delete item.path
    return item

}

export function guessWhichProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    // try specialized first
    if (isImage(item.path)) {
        imageProcessor(item, target)
    } else if (isAudio(item.path)) {
        audioProcessor(item, target)
    } else {
        const loaderType = mapExtensionToType(item.path)
        proxyHandler(item, target, loaderType)
    }
}


export function proxyHandler(item: DirTreeRecord, target: IConfigAssetTarget, hint: string|undefined = undefined) {
    //console.log(hint)
    switch (hint) {
        case "text":
            return textProcessor(item, target)
        case "css":
            return cssProcessor(item, target)
        case "bitmapFont":
            return bitmapFontProcessor(item, target)
        default:
            console.warn(`The hint value "${hint}" is unrecognized. Not changing`)
            return noopProcessor(item)
    }
}


// const fileparts = path.parse(PATH)
// const ns = path.basename(target.basePath)

// const key = `${ns}/${fileparts.name}`


// Object.assign(item, {key})

// // @ts-ignore
// delete item.name
// // console.log(item.name)

// // imagine a filter the moves to new object
// const testExt = mapExtensionToType(PATH)
// switch (null != testExt) {
//     case true:
//         Object.assign(item, {type: testExt})
//         break
// }

// if (null != item.type) {
//     // noop
// } else if (null != target.hint) {
//     Object.assign(item, {type: target.hint})
// } else if (isImage(PATH)) {
//     Object.assign(item, {type:"image"})
// } else if (isAudio(PATH)) {
//     Object.assign(item, {type: "audio"})
// } else {
//     Object.assign(item, {type: "unknown"})
// }


// // @ts-ignore
// if ("bitmapFont" == item.type) {
//     if (isXML(PATH)) {
//         Object.assign(item, {fontDataURL: item.path})
//     }               // 17
//     if (isImage(PATH)) {
//         Object.assign(item, {textureURL: item.path})
//     }
// } else {
//     Object.assign(item, {url: item.path})
// }

// // might need to keep item.path
// // @ts-ignore
// delete item.path

// if (!filePack.hasOwnProperty(target.key)) {
//     Object.assign(filePack, {
//         [target.key]: {
//             files: []
//         }
//     })
// }
// Reflect.get(filePack, target.key).files.push(item)
