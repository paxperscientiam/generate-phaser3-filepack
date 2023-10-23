// https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Types.Loader.FileTypes.PackFileConfig

import dirTree from "directory-tree"

import fs from 'fs'

const args = process.argv
const basePath = args[2] ?? "./"

try {
    if (!fs.existsSync(basePath)) {
        throw `The target directory does not exist: ${basePath}`
    }
} catch (err) {
    console.error(err);
    process.exit(1)
}

import path from 'path'

import isImage from 'is-image'

function isAudio(filepath) {
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

const filePack = {
    main: {
        files: []
    }
}


dirTree(
    `${basePath}`,
    {
        extensions: /\.(png|jpg|wav|ogg|)$/
    },
    (item, PATH) => {
        Object.assign(item, {"url": item.path})
        delete item.path

        const dir = path.dirname(PATH)

        const key = path.basename(PATH)
        Object.assign(item, {key})

        delete item.name

        if (isImage(PATH)) {
            Object.assign(item, {type:"image"})
        } else if (isAudio(PATH)) {
            Object.assign(item, {type: "audio"})
        } else {
            Object.assign(item, {type: "unknown"})
        }

        filePack['main'].files.push(item)
    }

)

console.log(JSON.stringify(filePack, null, 2))
