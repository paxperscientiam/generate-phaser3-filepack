import { DirectoryTree } from "directory-tree"
import { isAudio, isHTML, isJSON, isSVG, isXML, mapExtensionToType, prefixFromType } from "filetype-check"
import { IConfigAssetTarget } from "index.d"
import isImage from "is-image"
import path from "path"


// @ts-ignore
import isVideo from 'is-video'


type DirTreeRecord = DirectoryTree<Record<string,any>>

type DirTreeRecordTweak = DirTreeRecord & {
    key: string
}


function genericProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    let key: string
    const fileparts = path.parse(item.path)
    const ns = path.basename(target.basePath)

    if ("filebasename" === global.configData?.options?.keyFormat) {
        key = fileparts.name
    } else {
        key = `${ns}/${fileparts.name}`
    }

    Object.assign(item, {key})
    // @ts-ignore
    delete item.name

    return item
}

export function textProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget): DirTreeRecordTweak {
    genericProcessor(item, target)
    Object.assign(item, {type: "text"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

export function htmlProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget): DirTreeRecordTweak {
    genericProcessor(item, target)
    Object.assign(item, {type: "html"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

export function cssProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "css"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

function imageProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "image"})
    Object.assign(item, {url: item.path})

    if (true === global.configData.options?.applyProAssetKeyPrefix) {
        prefixFromType(item)
    }
    
    // @ts-ignore
    delete item.path
    return item
}

export function unknownProcessor(item: DirTreeRecordTweak): DirTreeRecordTweak {
    Object.assign(item, {type: "unknown"})
    return item
}

export function noopProcessor(item: DirTreeRecordTweak): DirTreeRecordTweak {
    return item
}

function audioProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "audio"})
    Object.assign(item, {url: item.path})
    Object.assign(item, {focalKey: "url"})
    // @ts-ignore
    delete item.path
    return item
}

function svgProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "svg"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

function jsonProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "json"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

function xmlProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "xml"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

function glslProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "glsl"})
    Object.assign(item, {shaderType: "fragment"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}


function videoProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "video"})
    Object.assign(item, {url: item.path})
    Object.assign(item, {focalKey: "url"})
    // @ts-ignore
    delete item.path
    return item
}

function bitmapFontProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "bitmapFont"})

    if (isXML(item.path)) {
        Object.assign(item, {fontDataURL: item.path})
    }

    if (isImage(item.path)) {
        Object.assign(item, {textureURL: item.path})
    }

    // @ts-ignore
    delete item.path

    Object.assign(item, {isDirty: false})

    return item
}

function atlasProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "atlas"})

    if (isJSON(item.path)) {
        Object.assign(item, {atlasURL: item.path})
    }

    if (isImage(item.path)) {
        Object.assign(item, {textureURL: item.path})
    }

    // @ts-ignore
    delete item.path
    return item
}

export function guessWhichProcessor(item: DirTreeRecordTweak, target: IConfigAssetTarget) {
    // note that order matters here
    if (isSVG(item.path)) {
        svgProcessor(item, target)
        //
    } else if (isImage(item.path)) {
        imageProcessor(item, target)
        //
    } else if (isAudio(item.path)) {
        audioProcessor(item, target)
        //
    } else if (isHTML(item.path)) {
        htmlProcessor(item, target)
        //
    } else if (isVideo(item.path)) {
        videoProcessor(item, target)
        //
    } else if (isJSON(item.path)) {
        jsonProcessor(item, target)
    } else if (isXML(item.path)) {
        xmlProcessor(item, target)
    } else {
        const loaderType = mapExtensionToType(item.path)
        proxyHandler(item, target, loaderType)
    }
}

export function proxyHandler(item: DirTreeRecordTweak, target: IConfigAssetTarget, hint: string|undefined = undefined) {
    if (false === Reflect.has(item, "isDirty")) {
        console.log('processessed, or processing, already')
        return noopProcessor(item)
    }

    switch (hint) {
        case "text":
            return textProcessor(item, target)
        case "css":
            return cssProcessor(item, target)
        case "bitmapFont":
            return bitmapFontProcessor(item, target)
        case "svg":
            return svgProcessor(item, target)
        case "html":
            return htmlProcessor(item, target)
        case "json":
            return jsonProcessor(item, target)
        case "image":
            return imageProcessor(item, target)
        case "xml":
            return xmlProcessor(item, target)
        case "atlas":
            return atlasProcessor(item, target)
        case "glsl":
            return glslProcessor(item, target)
        case undefined:
            return unknownProcessor(item)
        default:
            console.warn(`The hint value "${hint}" is unrecognized. Ignoring.`)
            return unknownProcessor(item)
    }
}
