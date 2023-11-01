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


/**
 * @toExtract
 */
export type IPhaserFilePackBinaryAsset = {
    type: string
    key: string
    url: string
    dataType: Uint8Array|unknown
}



/**
 * @toExtract
 */
export type IPhaserFilePackFiles = {
    files: IPhaserFilePackGenericAsset[]
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
