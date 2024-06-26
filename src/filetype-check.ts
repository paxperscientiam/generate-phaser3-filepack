import { IConfigAssetTarget } from "index"
import path from "path"

import { DirectoryTree } from "directory-tree"

type DirTreeRecord = DirectoryTree<Record<string,any>>
type DirTreeRecordTweak = DirTreeRecord & {
    key: string
}


// if found, then consider a match for genericProccessort
export function mapExtensionToType(filepath: string) {
    const ext = path.parse(filepath).ext.replace(/^\./, '')
    return Reflect.get({
        binary: "binary",
        css: "css",
        json: "json",
        svg: "svg",
        txt: "text",
        glsl: "glsl",
    }, ext)
}

export function prefixFromType(item: DirTreeRecordTweak) {
    let prefix: string
    switch (item.type as unknown as IConfigAssetTarget["hint"]) {
        case "image":
            prefix = "T_"
            break
        case "audio":
            prefix = "S_"
            break
        case "bitmapFont":
            prefix = "Font_"
            break
        case "spritesheet":
            prefix = "SS_"
            break
        default:
            prefix = ""
    }
    console.debug(`prefix is ${prefix} for ${item.type}`)
    Object.assign(item, {
        key: prefix + item.key
    })

}

export function isCollapsibleType(type: string): boolean {
    return [
        "audio",
        "bitmapFont",
        "atlas"
    ].includes(type)
}

export function isJSON(filepath:string) {
    return 'json' == path.parse(filepath).ext.replace(/^\./, '')
}

export function isCSS(filepath: string) {
    const ext = path.parse(filepath).ext.replace(/^\./, '')
    return "css" === ext
}

export function isXML(filepath:string) {
    return 'xml' == path.parse(filepath).ext.replace(/^\./, '')
}

export function isText(filepath:string) {
    return 'txt' == path.parse(filepath).ext.replace(/^\./, '')
}

export function isSVG(filepath:string) {
    return 'svg' == path.parse(filepath).ext.replace(/^\./, '')
}

export function isHTML(filepath:string) {
    return 'html' == path.parse(filepath).ext.replace(/^\./, '')
}

export function isAudio(filepath: string) {
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

