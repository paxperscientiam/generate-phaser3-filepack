/**
   @toExtract
 */
export interface IConfigAssetTarget {
    hint?: "audio"|"image"|"bitmapFont"|"binary"|"css"|string
    key: string
    basePath: string
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
}


interface Uint8Array {
    " buffer_kind"?: "uint8"; 
}

/**
 * @toExtract
 */
export type IPhaserFilePackBinaryAsset = {
    type: string
    key: string
    url: string
    dataType: Uint8Array
}


/**
 * @toExtract
 */
export type IPhaserFilePackAsset = IPhaserFilePackGenericAsset & IPhaserFilePackBinaryAsset

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
