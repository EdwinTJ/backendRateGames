import { z } from "zod";

export const newPostSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "It must have a title" }).min(1).max(55),
    image: z.string().optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "It must have a title" }).min(1).max(55),
    image: z.string().optional(),
  }),
  params: z.object({
    id: z.string({ required_error: "It must have a id" }),
  }),
});
