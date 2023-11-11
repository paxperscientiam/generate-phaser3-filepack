import { DirectoryTree } from "directory-tree"
import { isAudio, isHTML, isJSON, isSVG, isXML, mapExtensionToType } from "filetype-check"
import { IConfigAssetTarget } from "index.d"
import isImage from "is-image"
import path from "path"

// @ts-ignore
import isVideo from 'is-video'


type DirTreeRecord = DirectoryTree<Record<string,any>>

function genericProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    let key: string
    const globalOptions = global.configData.options
    const fileparts = path.parse(item.path)
    const ns = path.basename(target.basePath)

    if ("filebasename" === globalOptions?.keyFormat) {
        key = fileparts.name
    } else {
        key = `${ns}/${fileparts.name}`
    }

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

export function htmlProcessor(item: DirTreeRecord, target: IConfigAssetTarget): DirTreeRecord {
    genericProcessor(item, target)
    Object.assign(item, {type: "html"})
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
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
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

function svgProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "svg"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

function jsonProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "json"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

function xmlProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "xml"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}

function glslProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "glsl"})
    Object.assign(item, {shaderType: "fragment"})
    Object.assign(item, {url: item.path})
    // @ts-ignore
    delete item.path
    return item
}


function videoProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
    genericProcessor(item, target)
    Object.assign(item, {type: "video"})
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
        Object.assign(item, {fontDataURL: item.path})
    }

    if (isImage(item.path)) {
        Object.assign(item, {textureURL: item.path})
    }

    // @ts-ignore
    delete item.path
    return item
}

function atlasProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
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

export function guessWhichProcessor(item: DirTreeRecord, target: IConfigAssetTarget) {
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

export function proxyHandler(item: DirTreeRecord, target: IConfigAssetTarget, hint: string|undefined = undefined) {
    //console.log(hint)
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
            return noopProcessor(item)
        default:
            console.warn(`The hint value "${hint}" is unrecognized. Ignoring.`)
            return noopProcessor(item)
    }
}
