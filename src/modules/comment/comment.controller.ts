import { Request, Response } from "express";
import { commentServie } from "./comment.service";


const createComment=async(req:Request,res:Response)=>{
    try {
        
        // console.log(req.body)
        req.body.authorId=req.user?.id;
        const result=await commentServie.createComment(req.body);
    } catch (error) {
        res.status(400).json({
            message:"Comment creation fail",
            details:error
        })
    }
}

export const commentController={
    createComment,
}