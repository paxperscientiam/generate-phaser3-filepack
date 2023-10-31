/**
   @toExtract
 */
export interface IConfigAssetTarget {
    hint?: "audio"|"image"|"bitmapFont"|"binary"|"css"|string
    key: string
    basePath: string
    extensions: string | boolean
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
export interface IPhaserFilePackAsset {
    type: string
    key: string
    url: string | string[]
}

/**
 * @toExtract
 */
export interface IPhaserFilePackFiles {
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
