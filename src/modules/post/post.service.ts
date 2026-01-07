import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}

const getAllPost = async ({
    search,
    tags,
    isFeatured,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}: {
    search: string | undefined,
    tags: string[] | [],
    isFeatured: boolean | undefined,
    status: PostStatus | undefined,
    authorId: string | undefined,
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string
}) => {
    const andConditions: PostWhereInput[] = []

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search
                    }
                }
            ]
        })
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }

    if (typeof isFeatured === 'boolean') {
        andConditions.push({
            isFeatured
        })
    }

    if (status) {
        andConditions.push({
            status
        })
    }

    if (authorId) {
        andConditions.push({
            authorId
        })
    }

    const allPost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: { comments: true }
            }
        }
    });

    const total = await prisma.post.count({
        where: {
            AND: andConditions
        }
    })
    return {
        data: allPost,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getPostById = async (postId: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
           include:{
            comments:{
                where:{
                    parentId:null,
                    status:CommentStatus.APPROVED
                },
                orderBy:{
                    createdAt:"desc"
                },
                include:{
                    replies:{
                        where:{
                            status:CommentStatus.APPROVED
                        },
                        orderBy:{
                            createdAt:"asc"
                        },
                        include:{
                            replies:{
                                where:{
                                    status:CommentStatus.APPROVED
                                },
                                orderBy:{
                            createdAt:"asc"
                        }
                            }
                        }
                    }
                }
            },
            _count:{
                select:{comments:true}
            }
           }
        })
        return postData
    })
}

//! Find my post 
const findMyPosts=async(authorId:string)=>{
    await prisma.user.findUniqueOrThrow({
        where:{
            id:authorId,
            status:"ACTIVE"
        },
        select:{
            id:true
        }
    })
  const result=await prisma.post.findMany({
    where:{
        authorId
    },
    orderBy:{
        createdAt:"desc"
    },
    include:{
        _count:{
            select:{
                comments:true
            }
        }
    }
  });
//   const total=prisma.post.aggregate({
//     _count:{
//         id:true
//     },
//     where:{
//         authorId
//     }
//   })

  return result;
}

//? Update user post
const updateMyPost=async(postId:string,authorId:string,data:Partial<Post>,isAdmin:boolean)=>{
    const postData=await prisma.post.findFirstOrThrow({
        where:{
            id:postId
        },
        select:{
            id:true,
            authorId:true
        }
    })
    //! if not admin and it's not his post
    if(!isAdmin && postData.authorId!=authorId){
        throw new Error("You are not creator of this post");
    }
    //? Here checking is features for user
    if(!isAdmin){
        delete data.isFeatured;
    }
    return await prisma.post.update({
        where:{
            id:postId
        },
        data
    })
}
//! Delete post
// 1. Admin can delete all user post
// 2. User can delete only his post
const deletePost=async(postId:string,authorId:string,isAdmin:boolean)=>{
    //! 1. first of all find the post it's exists or nor
    const postData=await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        },
        select:{
            id:true,
            authorId:true
        }
    })
    //! 2. check if he is not admin and make sure that this post is his
    if(!isAdmin && postData.authorId!=authorId){
        throw new Error("You are not creator/owerner of this post");
    }
    return await prisma.post.delete({
        where:{
            id:postId
        }
    })
}


export const postService = {
    createPost,
    getAllPost,
    getPostById,
    findMyPosts,
    updateMyPost,
    deletePost
}