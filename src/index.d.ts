/**
   @toExtract
 */
export interface AssetTarget {
    hint?: string
    key: string
    basePath: string
    extensions: string | boolean
}


/**
 * @toExtract
 */
export interface IConfig {
    extenions?: string
    targets: AssetTarget[]
}
