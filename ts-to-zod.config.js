/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = {
    input: "src/index.d.ts",
    output: "src/index.zod.ts",
    jsDocTagFilter: (tags) => tags.map(tag => tag.name).includes("toExtract")
};
