import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findFirstOrThrow({
    where: {
      id: payload.postId,
    },
  });
  if (payload.parentId) {
    await prisma.comment.findFirstOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentbyId = async (id: string) => {
  return prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentbyAuthor = async (authorId: string) => {
  // console.log(authorId)
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          title: true,
          id: true,
        },
      },
    },
  });
};

// 1. nijar comment delete korta parbe
// login thakte hobe
// tar nijar comment kina ata check korta hobe
const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

//! UPdate comment
//? Need information 1. author id,comment id and updated data

const updateCommnet = async (
  authorId: string,
  data: { content?: string; status?: CommentStatus },
  commentId: string
) => {
    const commentData=await prisma.comment.findFirst({
        where:{
            id:commentId,
            authorId
        },
        select:{
            id:true
        }
    })
    if(!commentData){
        throw new Error("Your provided input is invalid");
    }
    return await prisma.comment.update({
        where:{
            id:commentId
        },
        data
    })
};

//! Comment update by admin
const moderateComment=async(id:string, data:{status:CommentStatus})=>{
  const commentData=await prisma.comment.findUniqueOrThrow({
    where:{
      id
    },
    select:{
      id:true,
      status:true
    }
  })
  if(commentData.status===data.status){
    throw new Error(`Your provided status (${data.status}) is already upto date`);
  }
  return await prisma.comment.update({
    where:{
      id
    },data
  })
}


export const commentServie = {
  createComment,
  getCommentbyId,
  getCommentbyAuthor,
  deleteComment,
  updateCommnet,
  moderateComment,
};
