import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const result = await postService.createPost(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
       next(e);
    }
}


const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
        // true or false
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined

        const status = req.query.status as PostStatus | undefined

        const authorId = req.query.authorId as string | undefined

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const result = await postService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder })
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new Error("Post Id is required!")
        }
        const result = await postService.getPostById(postId);
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Can't find post",
            details: e
        })
    }
}
//! Find my posts
const findMyPosts=async(req:Request,res:Response)=>{
    try {
        const user=req.user;
        const result=await postService.findMyPosts(user?.id as string);
        res.status(200).json({
            message:"Post retrive successfull",
            data:result
        })
    } catch (error) {
        const erroMessage= (error instanceof Error)? error.message:"Post fetch fail";
        res.status(400).json({
            message:erroMessage,
            details:error
        })
    }
}

//? Update my post
const updateMyPost=async(req:Request,res:Response)=>{
    try {
        const {postId}=req.params;
        const user=req.user;
        if(!user){
            throw new Error("You are not authorized")
        }
        const data=req.body;
        const isAdmin=user.role===UserRole.ADMIN;
        // console.log(user)
        const result=await postService.updateMyPost(postId as string,user.id, data,isAdmin);
        res.status(200).json({
            message:"Post updated successfully",
            data:result
        })
    } catch (error) {
        const errorMessage=(error instanceof Error)?error.message:"Post Update fali";
        res.status(400).json({
            message:errorMessage,
            error
        })
    }
}
//! Delete post
const deletePost=async(req:Request,res:Response)=>{
    try {
        const user=req.user;
        if(!user){
            throw new Error("You are not authorized");
        }
        // console.log(user)
        const {postId}=req.params;
        const isAdmin=user.role===UserRole.ADMIN;
        const result=await postService.deletePost(postId as string,user.id as string,isAdmin);
        res.status(200).json({
            message:"Post delete successfull",
            data:result
        })
    } catch (error) {
        const errorMessage=(error instanceof Error)? error.message:"Post Delete fail";
        res.status(400).json({
            message:errorMessage,
            error
        })
    }
}
const getStats=async(req:Request,res:Response)=>{
    try {
        
        const result=await postService.getStats();
        res.status(200).json({
            message:"All Stats fetch successfull",
            data:result
        })
    } catch (error) {
        const errorMessage=(error instanceof Error)? error.message:"Stats fetch fail";
        res.status(400).json({
            message:errorMessage,
            error
        })
    }
}

export const PostController = {
    createPost,
    getAllPost,
    getPostById,
    findMyPosts,
    updateMyPost,
    deletePost,
    getStats
}