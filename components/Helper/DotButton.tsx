// 'use client';
// import { Post, User } from "@/types";
// import React from "react";
// import { useDispatch } from "react-redux";
// import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
// import { Ellipsis } from "lucide-react";
// import { Button } from "../ui/button";
// import Link from "next/link";

// type Props={
//     post:Post|null;
//     user:User|null;
// }

// const DotButton=({post,user}:Props)=>{
//     const isOwnPost=post?.user?._id===user?._id;
//     const isFollowing=post?.user?._id?user?.following.includes(post.user._id):false;

//     const dispatch=useDispatch();

//     const handleDeletePost=async()=>{}


//     return <div className="cursor-pointer">
//         <Dialog>
//             <DialogTrigger>
//                 <Ellipsis className="w-8 h-8 text-black"/>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogTitle></DialogTitle>
//                 <div className="space-y-4 flex flex-col w-fit justify-center items-center mx-auto cursor-pointer">
//                     {!isOwnPost&&(
//                         <div>
//                             <Button variant={isFollowing?"destructive":"secondary"}>
//                                 {isFollowing?"Unfollow":"Follow"}
//                             </Button>
//                         </div>
//                     )}
//                     <Link href={`/profile/${post?.user?._id}`}>
//                 <Button variant={"secondary"}>
//                     About This Account
//                 </Button>
//                 </Link>
//                 {isOwnPost&&(
//                     <Button variant={"destructive"} onClick={handleDeletePost}>
//                         Delete Post
//                     </Button>
//                 )}
//                 <DialogClose>
//                     Cancel
//                 </DialogClose>
//                 </div>
                
//             </DialogContent>
//         </Dialog>
//     </div>
// }
// export default DotButton;
// 'use client';
// import { Post, User } from "@/types";
// import React from "react";
// import { useDispatch } from "react-redux";
// import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
// import { Ellipsis } from "lucide-react";
// import { Button } from "../ui/button";
// import Link from "next/link";
// import { useFollowUnfollow } from "../hooks/use-auth";

// type Props = {
//     post: Post | null;
//     user: User | null;
// };

// const DotButton = ({ post, user }: Props) => {
//     const isOwnPost = String(post?.user?._id) === String(user?._id);  // ✅ Fixed this line
//     const isFollowing = post?.user?._id ? user?.following.includes(post.user._id) : false;

//     console.log("Post Owner ID:", post?.user?._id);
//     console.log("Logged-in User ID:", user?._id);
//     console.log("isOwnPost:", isOwnPost);
//      const {handleFollowUnfollow}=useFollowUnfollow();
//     const dispatch = useDispatch();

//     const handleDeletePost = async () => {};

//     return (
//         <div className="cursor-pointer">
//             <Dialog>
//                 <DialogTrigger>
//                     <Ellipsis className="w-8 h-8 text-black cursor-pointer" />
//                 </DialogTrigger>
//                 <DialogContent className="p-6 bg-white rounded-lg shadow-lg w-80">
//     <DialogTitle></DialogTitle>
//     <div className="space-y-4 flex flex-col items-center">
//         {!isOwnPost && (
//             <Button onClick={()=>{handleFollowUnfollow(post?.user?._id)}} className="text-sm text-white bg-gray-500 cursor-pointer" variant={isFollowing ? "destructive" : "secondary"}>
//                                 {isFollowing ? "Unfollow" : "Follow"}
//                               </Button>
//         )}

//         <Link href={`/profile/${post?.user?._id}`}>
//             <Button variant={"secondary"} className="bg-gray-100 cursor-pointer">About This Account</Button>
//         </Link>

//         {isOwnPost && (
//             <Button variant={"destructive"} onClick={handleDeletePost} className=" bg-red-500 w-full text-black cursor-pointer">
//                 Delete Post
//             </Button>
//         )}

//         <DialogClose className=" bg-gray-100 cursor-pointer text-gray-600">Cancel</DialogClose>
//     </div>
// </DialogContent>

//             </Dialog>
//         </div>
//     );
// };

// export default DotButton;
"use client";

import { Post, User } from "@/types";
import React, { useState, useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useFollowUnfollow } from "../hooks/use-auth";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../utils/apiRequest";
import { deletePost } from "@/store/postSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type Props = {
    post: Post | null;
    user: User | null;
};

const DotButton = ({ post, user }: Props) => {
    const isOwnPost = String(post?.user?._id) === String(user?._id);
    const dispatch=useDispatch();
    // ✅ Local State for Dynamic UI Update
    const [localFollowing, setLocalFollowing] = useState(user?.following || []);

    useEffect(() => {
        setLocalFollowing(user?.following || []);
    }, [user]);

    const { handleFollowUnfollow } = useFollowUnfollow();

    const handleFollowClick = async () => {
        const updatedUser = await handleFollowUnfollow(post?.user?._id);
        if (updatedUser) {
            setLocalFollowing(updatedUser.following);  // ✅ Local state update
        }
    };
    const handleDeletePost=async  ()=>{
        const deletePostReq=async()=> await axios.delete(`${BASE_API_URL}/posts/deletepost/${post?._id}`,{withCredentials:true});
        const result=await handleAuthRequest(deletePostReq);
        if(result?.data.status=='success'){
            if(post?._id){
                dispatch(deletePost(post._id));
                toast.success(result.data.message);
                redirect("/");
            }
        }
    }

    return (
        <div className="cursor-pointer">
            <Dialog>
                <DialogTrigger>
                    <Ellipsis className="w-8 h-8 text-black cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="p-6 bg-white rounded-lg shadow-lg w-80">
                    <DialogTitle></DialogTitle>
                    <div className="space-y-4 flex flex-col items-center">
                        {!isOwnPost && (
                            <Button
                                onClick={handleFollowClick}
                                className="text-sm text-white bg-gray-500 cursor-pointer"
                                variant={localFollowing.includes(post?.user?._id) ? "destructive" : "secondary"}
                            >
                                {localFollowing.includes(post?.user?._id) ? "Unfollow" : "Follow"}
                            </Button>
                        )}

                        <Link href={`/profile/${post?.user?._id}`}>
                            <Button variant="secondary" className="bg-gray-100 cursor-pointer">
                                About This Account
                            </Button>
                        </Link>

                        {isOwnPost && (
                            <Button
                                variant="destructive"
                                className="bg-red-500 w-full text-black cursor-pointer"
                            onClick={handleDeletePost}>
                                Delete Post
                            </Button>
                        )}

                        <DialogClose className="bg-gray-100 cursor-pointer text-gray-600">Cancel</DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DotButton;
