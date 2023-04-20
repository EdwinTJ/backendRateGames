import { Router } from "express";
import {
  getAllComments,
  newComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { validate } from "../middleware/zodMiddleware";
import {
  newCommentSchema,
  deleteCommentSchema,
} from "../schemas/commentSchema";

//router.method(path, validate(schema), controller)

const router = Router();

router.get("/:id", getAllComments);
router.post("/new/:id", validate(newCommentSchema), newComment);
router.put("/:id", updateComment);
router.delete("/:id", validate(deleteCommentSchema), deleteComment);
export { router as commentRoutes };
