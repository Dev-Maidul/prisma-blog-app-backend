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
router.patch("/:commentId",auth(UserRole.ADMIN,UserRole.USER),commentController.updateComment);
router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.deleteComment
);

router.patch("/:commentId/modarate",auth(UserRole.ADMIN),commentController.moderateComment)

export const commentRouter: Router = router;
