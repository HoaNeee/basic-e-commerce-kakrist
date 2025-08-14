/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { del, get, post } from "@/utils/requets";
import { CommentModel } from "@/models/reviewModel";
import { toast } from "sonner";
import ItemListComment from "./ItemListComment";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Skeleton } from "../ui/skeleton";

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
  const [commentAddedChild, setcommentAddedChild] = useState<CommentModel>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);

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
      setIsLoading(true);
      const response = await get(
        `/reviews/comments/${review_id}?parent_id=${parent_id}`
      );
      setComments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (
    parent_id: string,
    product_id: string,
    review_id: string,
    content: string
  ) => {
    try {
      const response = await post("/reviews/create-comment", {
        content: content,
        review_id: review_id,
        parent_id: parent_id,
        product_id: product_id,
      });

      const comment: CommentModel = response?.data;

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

      setcommentAddedChild({
        ...comment,
        user: {
          firstName: auth.firstName,
          lastName: auth.lastName,
          avatar: auth.avatar,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async (item: CommentModel) => {
    setIsDeleting(true);
    try {
      const response = await del("/reviews/delete-comment", item._id);
      toast.success(response.message, {
        description: "That comment was be remove",
        action: {
          label: "Close",
          onClick() {},
        },
      });
      setComments(comments.filter((comment) => comment._id !== item._id));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="ml-8 mt-3">
          <div className="flex gap-3 items-center ">
            <Skeleton className="size-7 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-2 w-30" />
              <Skeleton className="h-3 w-25" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Skeleton className="h-2" />
            <Skeleton className="h-2 w-2/3" />
          </div>
          <Skeleton className="mt-3 mb-1 lg:w-1/4 sm:w-1/3 w-full h-2" />
        </div>
      )}
      <div className="md:ml-8 ml-4 border-l-2 border-gray-200 dark:border-gray-700">
        {!isLoading &&
          comments &&
          comments.map((item, index: number) => (
            <div key={index} className="md:ml-8 ml-4 mt-3">
              <ItemListComment
                isComment
                item={item}
                onSubmit={async (val: string) => {
                  await handleSubmitComment(
                    item._id,
                    item.product_id,
                    item.review_id,
                    val
                  );
                }}
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
                isUser={auth.user_id === item.user_id}
                onDelete={(val) => {
                  handleDeleteComment(val);
                }}
                loading={isDeleting}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListComment;
