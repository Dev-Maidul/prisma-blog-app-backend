import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
    await prisma.post.findFirstOrThrow({
        where:{
            id:payload.postId
        }
    })
    if(payload.parentId){
        await prisma.comment.findFirstOrThrow({
        where:{
            id:payload.parentId
        }
    })
    }
    return await prisma.comment.create({
        data:payload
    })
};

const getCommentbyId=async(id:string)=>{
    return prisma.comment.findUnique({
        where:{
            id
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    views:true
                }
            }
        }
    })
}

const getCommentbyAuthor=async(authorId:string)=>{
    console.log(authorId)
    return await prisma.comment.findMany({
        where:{
            authorId
        },
        orderBy:{createdAt:"desc"},
        include:{
            post:{
                select:{
                    title:true,
                    id:true
                    
                }
            }
        }
    })
}

export const commentServie = {
  createComment,
  getCommentbyId,
  getCommentbyAuthor
};
