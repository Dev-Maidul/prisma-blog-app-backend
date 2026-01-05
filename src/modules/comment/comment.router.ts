import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { commentController } from "./comment.controller";

const router = express.Router();

router.get("/author/:authorId", commentController.getCommentbyAuthor);
router.get("/:commentId", commentController.getCommentbyId);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);
router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.deleteComment
);

export const commentRouter: Router = router;
