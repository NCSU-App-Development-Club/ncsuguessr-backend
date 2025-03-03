import { z } from 'zod'

export const ImageSubmissionForm = z.object({
  latitude: z.string().transform(Number),
  longitude: z.string().transform(Number),
  description: z.string(),
  takenAt: z.string().transform((val) => new Date(val)),
  locationName: z.string(),
})

export type ImageSubmissionFormType = z.infer<typeof ImageSubmissionForm>

export const CreateGameRequestBody = z.object({
  imageId: z.number(),
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => (val ? !isNaN(val.getTime()) : true)),
})

export const GetGamesSearchParams = z.object({
  date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((val) => (val ? !isNaN(val.getTime()) : true)),
})

export type GetGamesSearchParamsType = z.infer<typeof GetGamesSearchParams>

export const GetImagesSearchParams = z.object({
  validated: z
    .string()
    .optional()
    .transform((val) =>
      val === 'true' ? true : val === 'false' ? false : undefined
    ),
})

export type GetImagesSearchParamsType = z.infer<typeof GetImagesSearchParams>

export const ErrorResponseBody = z.object({
  error: z.string(),
})

export type ErrorResponseBodyType = z.infer<typeof ErrorResponseBody>
