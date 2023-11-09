/**
   @toExtract
 */
export interface IConfigAssetTarget {
    key: string
    basePath: string
    hint?: "audio"|"image"|"bitmapFont"|"binary"|"css"|string
    extensions?: string
    ignoredPaths?: string|string[]
}


/**
 * @toExtract
 */
export interface IConfig {
    extensions?: string
    targets: IConfigAssetTarget[]
}


/**
 * @toExtract
 */
export type IPhaserFilePackGenericAsset = {
    type: string
    key: string
    url: string | string[]
    focalKey?: string
}


interface Uint8Array {
    " buffer_kind"?: "uint8"; 
}

/**
 * @toExtract
 */
export type IPhaserFilePackBinaryAsset = {
    type: "binary"
    key: string
    url: string
    dataType: Uint8Array
}

/**
 * @toExtract
 */
export type IPhaserFilePackVideoAsset = {
    type: "video"
    asBlob?: boolean
    noAudio?: boolean
    key: string
    url: string | string[]
}


/**
 * @toExtract
 */
export type IPhaserFilePackAsset = IPhaserFilePackGenericAsset & IPhaserFilePackBinaryAsset & IPhaserFilePackVideoAsset

/**
 * @toExtract
 */
export type IPhaserFilePackFiles = {
    files: IPhaserFilePackAsset[]
}

/**
 * @toExtract
 */
export type FilePack = {
    meta: {
        generated: number
    }
} & {
    [prop:string]: IPhaserFilePackFiles
}
