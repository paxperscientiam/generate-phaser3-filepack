// Generated by ts-to-zod
import { z } from "zod";

export const iConfigAssetTargetSchema = z.object({
  key: z.string(),
  basePath: z.string(),
  hint: z
    .union([
      z.literal("audio"),
      z.literal("image"),
      z.literal("bitmapFont"),
      z.literal("binary"),
      z.literal("css"),
      z.string(),
    ])
    .optional(),
  extensions: z.string().optional(),
  ignoredPaths: z.union([z.string(), z.array(z.string())]).optional(),
});

export const iConfigSchema = z.object({
  extensions: z.string().optional(),
  targets: z.array(iConfigAssetTargetSchema),
});

export const iPhaserFilePackGenericAssetSchema = z.object({
  type: z.string(),
  key: z.string(),
  url: z.union([z.string(), z.array(z.string())]),
  focalKey: z.string().optional(),
});

const uint8ArraySchema = z.object({
  " buffer_kind": z.literal("uint8").optional(),
});

export const iPhaserFilePackVideoAssetSchema = z.object({
  type: z.literal("video"),
  asBlob: z.boolean().optional(),
  noAudio: z.boolean().optional(),
  key: z.string(),
  url: z.union([z.string(), z.array(z.string())]),
});

export const iPhaserFilePackBinaryAssetSchema = z.object({
  type: z.literal("binary"),
  key: z.string(),
  url: z.string(),
  dataType: uint8ArraySchema,
});

export const iPhaserFilePackAssetSchema = iPhaserFilePackGenericAssetSchema
  .and(iPhaserFilePackBinaryAssetSchema)
  .and(iPhaserFilePackVideoAssetSchema);

export const iPhaserFilePackFilesSchema = z.object({
  files: z.array(iPhaserFilePackAssetSchema),
});

export const filePackSchema = z
  .object({
    meta: z.object({
      generated: z.number(),
    }),
  })
  .and(z.record(iPhaserFilePackFilesSchema));
