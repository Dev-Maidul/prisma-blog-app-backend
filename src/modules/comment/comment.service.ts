const createComment=async(payload:{
    id:string;
    content:string;
    authorId:string;
    postId:string;
    parentId?:string
})=>{

    console.log(payload)
}


export const commentServie={
    createComment,
}