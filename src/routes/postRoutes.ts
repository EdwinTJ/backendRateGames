import { Router } from "express";
import {
  getAllPosts,
  newPost,
  updatePost,
  deletePost,
  getSinglePost,
} from "../controllers/postController";
import { validate } from "../middleware/zodMiddleware";
import { newPostSchema, updatePostSchema } from "../schemas/postSchema";
//router.method(path, validate(schema), controller)

const router = Router();

router.get("/", getAllPosts);
router.get("/single/:id", getSinglePost);
router.post("/create", validate(newPostSchema), newPost);
router.put("/:id", validate(updatePostSchema), updatePost);
router.delete("/:id", deletePost);
export { router as postRoutes };
