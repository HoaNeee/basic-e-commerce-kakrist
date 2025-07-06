/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { get, post } from "@/utils/requets";
import { CommentModel } from "@/models/reviewModel";
import { Input } from "../ui/input";
import { toast } from "sonner";
import ItemListComment from "./ItemListComment";

interface Props {
  parent_id?: string;
  review_id?: string;
  commentAdded?: CommentModel;
}

const ListComment = (props: Props) => {
  const { parent_id, review_id, commentAdded } = props;

  const [comments, setComments] = useState<CommentModel[]>([]);
  const [idsShowComment, setIdsShowComment] = useState<string[]>(); //comment_id
  const [idShowReply, setIdShowReply] = useState(""); //comment_id
  const [contentReply, setContentReply] = useState("");
  const [commentAddedChild, setcommentAddedChild] = useState<CommentModel>();

  useEffect(() => {
    getComments(review_id || "", parent_id);
  }, []);

  useEffect(() => {
    if (commentAdded) {
      setComments([...comments, commentAdded]);
    }
  }, [commentAdded]);

  const getComments = async (review_id: string, parent_id = "") => {
    try {
      const response = await get(
        `/reviews/comments/${review_id}?parent_id=${parent_id}`
      );
      setComments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitComment = async (
    parent_id: string,
    product_id: string,
    review_id: string
  ) => {
    try {
      const response = await post("/reviews/create-comment", {
        content: contentReply,
        review_id: review_id,
        parent_id: parent_id,
        product_id: product_id,
      });

      const comment: CommentModel = response?.data;

      setContentReply("");

      toast.success("Posted", {
        action: {
          label: "Close",
          onClick() {},
        },
        position: "top-center",
      });

      const ids = [...(idsShowComment || [])];
      if (!ids.includes(comment.parent_id)) {
        ids.push(comment.parent_id);
        setIdsShowComment(ids);
        return;
      }

      setcommentAddedChild(comment);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {comments &&
        comments.map((item, index: number) => (
          <div key={index} className="ml-8 mt-3">
            <ItemListComment
              isComment
              item={item}
              onSubmit={async () => {}}
              commentAdded={commentAddedChild}
              idShowReply={idShowReply}
              idsShowComment={idsShowComment}
              onCancelReply={() => setIdShowReply("")}
              onShowComment={() => {
                const ids = [...(idsShowComment || [])];
                if (!ids?.includes(item._id)) {
                  ids?.push(item._id);
                }
                setIdsShowComment(ids);
              }}
              onHideComment={() => {
                if (idsShowComment?.includes(item._id)) {
                  setIdsShowComment(
                    idsShowComment.filter((it) => it !== item._id)
                  );
                }
              }}
              onShowReply={() => setIdShowReply(item._id)}
              parent_id={item._id}
              review_id={review_id}
            />
          </div>
          //   <div className="flex gap-2">
          //     <Avatar className="border border-neutral-200">
          //       <AvatarImage
          //         src={
          //           item.user?.avatar ??
          //           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRadJ-YmNxJTg6v9iO22fzR_65KenYJHFB5zg&s"
          //         }
          //         alt="avatar"
          //         className=""
          //       />
          //       <AvatarFallback>CN</AvatarFallback>
          //     </Avatar>
          //     <p className="text-sm">
          //       {item.user?.firstName} {item.user?.lastName}
          //     </p>
          //   </div>
          //   <div className="mt-3 ml-2">
          //     <p className="text-sm tracking-wider">{item.content}</p>
          //     <div className="text-xs tracking-wider text-muted-foreground flex items-center">
          //       <p>
          //         Posted on{" "}
          //         <span className="text-black font-medium">
          //           {new Date(item.createdAt).toLocaleDateString()}
          //         </span>
          //       </p>

          //       <div className="h-full text-muted-foreground mx-1">|</div>
          //       <Button
          //         size={"sm"}
          //         className="text-xs tracking-wider p-0 text-muted-foreground hover:text-black"
          //         variant={"link"}
          //         onClick={() => {
          //           setIdShowReply(item._id);
          //         }}
          //       >
          //         Reply
          //       </Button>
          //       {item?.countComment && item.countComment > 0 ? (
          //         <>
          //           <div className="h-full text-muted-foreground mx-1">|</div>
          //           {!idsShowComment?.includes(item._id) ? (
          //             <Button
          //               size={"sm"}
          //               className="text-xs tracking-wider p-0 text-muted-foreground hover:text-black"
          //               variant={"link"}
          //               onClick={() => {
          //                 const ids = [...(idsShowComment || [])];
          //                 if (!ids?.includes(item._id)) {
          //                   ids?.push(item._id);
          //                 }
          //                 setIdsShowComment(ids);
          //               }}
          //             >
          //               <p>Show {item.countComment} comment</p>
          //             </Button>
          //           ) : (
          //             <Button
          //               size={"sm"}
          //               className="text-xs tracking-wider p-0 text-muted-foreground hover:text-black"
          //               variant={"link"}
          //               onClick={() => {
          //                 if (idsShowComment?.includes(item._id)) {
          //                   setIdsShowComment(
          //                     idsShowComment.filter((it) => it !== item._id)
          //                   );
          //                 }
          //               }}
          //             >
          //               <p>Hide {item.countComment} comment</p>
          //             </Button>
          //           )}
          //         </>
          //       ) : (
          //         <></>
          //       )}
          //     </div>
          //   </div>

          //   {idShowReply === item._id && (
          //     <div className="flex gap-2 flex-col">
          //       <Input
          //         id={"reply-" + item._id}
          //         className="w-1/2"
          //         placeholder="replying @name"
          //         value={contentReply}
          //         onChange={(e) => setContentReply(e.target.value)}
          //         onKeyUp={async (e) => {
          //           if (e.code === "Enter") {
          //             if (contentReply) {
          //               await handleSubmitComment(
          //                 item._id,
          //                 item.product_id,
          //                 item.review_id
          //               );
          //             }
          //           }
          //         }}
          //       />
          //       <div className="text-sm flex items-center gap-2">
          //         <Button
          //           variant={"outline"}
          //           size={"sm"}
          //           onClick={() => {
          //             if (contentReply) {
          //               setContentReply("");
          //             }
          //             setIdShowReply("");
          //           }}
          //         >
          //           Cancel
          //         </Button>
          //         <Button
          //           variant={"default"}
          //           size={"sm"}
          //           onClick={async () => {
          //             if (contentReply) {
          //               await handleSubmitComment(
          //                 item._id,
          //                 item.product_id,
          //                 item.review_id
          //               );
          //             }
          //           }}
          //         >
          //           Submit
          //         </Button>
          //       </div>
          //     </div>
          //   )}

          //   {idsShowComment?.includes(item._id) && (
          //     <ListComment
          //       parent_id={item._id}
          //       review_id={review_id}
          //       commentAdded={commentAddedChild}
          //     />
          //   )}
          // </div>
        ))}
    </div>
  );
};

export default ListComment;
