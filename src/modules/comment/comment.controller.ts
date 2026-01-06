import { Request, Response } from "express";
import { commentServie } from "./comment.service";


const createComment=async(req:Request,res:Response)=>{
    try {
        req.body.authorId=req.user?.id;
        const result=await commentServie.createComment(req.body);
        res.status(201).json({
            message:"Comment Created successfully",
            data:result
        })
    } catch (error) {
        res.status(400).json({
            message:"Comment creation fail",
            details:error
        })
    }
}

const getCommentbyId=async(req:Request,res:Response)=>{
    try {
        const {commentId}=req.params;
        const result=await commentServie.getCommentbyId(commentId as string);
        res.status(200).json({
            message:"Comment fetch sussessfully",
            result
        })
    } catch (error) {
        res.status(400).json({
            message:"Can not fetch comment",
            error
        })
    }
}

const getCommentbyAuthor=async(req:Request,res:Response)=>{
    try {
        const {authorId}=req.params;
        const result=await commentServie.getCommentbyAuthor(authorId as string);
        res.status(200).json({
            message:"Comment fetch successfull",
            data:result
        })
    } catch (error) {
        res.status(400).json({
            message:"Can not find comment",
            error
        })
    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentServie.deleteComment(commentId as string, user?.id as string)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Comment delete failed!",
            details: e
        })
    }
}

const updateComment=async(req:Request,res:Response)=>{
    try {
        const user=req.user;
        const {commentId}=req.params;
        const data=req.body;
        const result=await commentServie.updateCommnet(user?.id as string,data,commentId as string);
        res.status(200).json({
            message:"Comment updated successfully",
            data:result
        })
    } catch (error) {
        message:"Comment update fail"
        details:error
    }
}
const moderateComment=async(req:Request,res:Response)=>{
    try {
        const {commentId}=req.params;
        const result=await commentServie.moderateComment(commentId as string, req.body);

        res.status(200).json({
            mesage:"Comment update successfull",
            data:result
        })
    } catch (error) {
        const errorMessage= (error instanceof Error)? error.message:"Comment update fail";
        res.status(400).json({
            message:errorMessage,
            error
        })
    }
}

export const commentController={
    createComment,
    getCommentbyId,
    getCommentbyAuthor,
    deleteComment,
    updateComment,
    moderateComment
}