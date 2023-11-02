import path from "path"

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
