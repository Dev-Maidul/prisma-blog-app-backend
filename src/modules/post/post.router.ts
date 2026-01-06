import express, { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", PostController.getAllPost);
router.get("/my-posts",auth(UserRole.ADMIN,UserRole.USER),PostController.findMyPosts);
router.get("/:postId", PostController.getPostById);

router.post("/", auth(UserRole.USER), PostController.createPost);

export const postRouter: Router = router;
