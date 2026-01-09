import { Request, Response } from "express";

export const notFound=(req:Request,res:Response)=>{
    res.status(404).json({
        message:"Page not found",
        path:req.originalUrl,
        date:Date()
    })
}