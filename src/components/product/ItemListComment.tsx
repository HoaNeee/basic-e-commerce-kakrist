/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Rating, RatingButton } from "../ui/rating";
import { StarIcon, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ListComment from "./ListComment";
import { CommentModel, ReviewModel } from "@/models/reviewModel";
import DialogConfirm from "../dialog/DialogConfirm";
import { Spinner } from "../ui/spinner";

interface Props {
  item: ReviewModel | CommentModel | any;
  onShowReply?: () => void;
  idsShowComment?: string[];
  idShowReply?: string;
  onSubmit: (content: string) => Promise<void>;
  commentAdded?: CommentModel;
  isComment?: boolean;
  onShowComment?: () => void;
  onHideComment?: () => void;
  onCancelReply?: () => void;
  review_id?: string;
  parent_id?: string;
  isUser: boolean; //me
  onDelete?: (val: any) => void;
  loading?: boolean;
}

const ItemListComment = (props: Props) => {
  const {
    item,
    onShowReply,
    idsShowComment,
    idShowReply,
    onShowComment,
    onSubmit,
    commentAdded,
    isComment,
    onHideComment,
    onCancelReply,
    review_id,
    parent_id,
    isUser,
    onDelete,
    loading,
  } = props;

  const [contentReply, setContentReply] = useState("");

  return (
    <div className="w-full">
      <div className={`flex gap-3 ${isComment ? "" : "items-center"}`}>
        <Avatar className="bg-gray-100/50">
          <AvatarImage src={item.user?.avatar} alt="avatar" />
          <AvatarFallback>
            <User size={22} />
          </AvatarFallback>
        </Avatar>
        <div className="">
          {item.user?.firstName || item.user?.lastName ? (
            <p className="text-sm">
              {item.user?.firstName} {item.user?.lastName}
            </p>
          ) : (
            <p className="text-sm">User</p>
          )}
          {!isComment && (
            <div className={`flex items-center`}>
              <Rating className="" readOnly defaultValue={item.star}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton
                    key={index}
                    size={18}
                    className={
                      index <= item.star - 1
                        ? "text-yellow-500 "
                        : "text-muted-foreground"
                    }
                    //var(--muted-foreground)
                    icon={<StarIcon strokeWidth={1} />}
                    index={index}
                  />
                ))}
              </Rating>
            </div>
          )}
        </div>
      </div>
      <div
        className="space-y-1 my-1"
        style={{
          marginTop: isComment ? "8px" : "",
          marginLeft: isComment ? "8px" : "",
        }}
      >
        <p className="font-bold">{item.title}</p>
        <p className="tracking-wider text-sm">
          {item.content ||
            (isComment && (
              <span className="text-neutral-300">This comment no content!</span>
            ))}
        </p>
      </div>
      {!isComment && item?.images && item.images.length > 0 && (
        <div className="my-2 flex gap-1 flex-wrap">
          {item.images.map((url: string) => {
            return (
              <div key={url} className="w-30 h-40">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      )}
      <div>
        <div
          className="text-xs tracking-wider text-muted-foreground flex items-center"
          style={{
            marginLeft: isComment ? "8px" : "",
          }}
        >
          <p>
            Posted on{" "}
            <span className="text-black font-medium">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </p>

          <div className="h-full text-muted-foreground mx-1">|</div>
          <Button
            size={"sm"}
            className="text-xs tracking-wider p-0 text-muted-foreground hover:text-black"
            variant={"link"}
            onClick={onShowReply}
          >
            Reply
          </Button>

          {isUser && (
            <>
              <div className="h-full text-muted-foreground mx-1">|</div>
              <DialogConfirm
                onConfirm={() => {
                  if (onDelete) {
                    onDelete(item);
                  }
                }}
              >
                <Button
                  size={"sm"}
                  className="text-xs tracking-wider p-0 text-muted-foreground hover:text-red-500 flex relative"
                  variant={"link"}
                  title="Delete this comment"
                  disabled={loading}
                >
                  <p
                    className=""
                    style={{
                      opacity: loading ? "0.2" : "1",
                    }}
                  >
                    Delete
                  </p>
                  <div
                    className="absolute w-full transition-all duration-300 h-full left-0 items-center flex justify-center"
                    style={{
                      opacity: loading ? "1" : "0",
                      visibility: loading ? "visible" : "hidden",
                    }}
                  >
                    <Spinner />
                  </div>
                </Button>
              </DialogConfirm>
            </>
          )}

          {item?.countComment && item.countComment > 0 ? (
            <>
              <div className="h-full text-muted-foreground mx-1">|</div>
              {!idsShowComment?.includes(item._id) ? (
                <Button
                  size={"sm"}
                  className="text-xs tracking-wider p-0 text-muted-foreground hover:text-black"
                  variant={"link"}
                  onClick={onShowComment}
                >
                  <p>Show {item.countComment} comment</p>
                </Button>
              ) : (
                <Button
                  size={"sm"}
                  className="text-xs tracking-wider p-0 text-muted-foreground hover:text-black"
                  variant={"link"}
                  onClick={onHideComment}
                >
                  <p>Hide {item.countComment} comment</p>
                </Button>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        {idShowReply === item._id && (
          <div className="flex gap-2 flex-col">
            <Input
              id={"reply-" + item._id}
              className="w-1/2"
              placeholder={`replying @${item?.user?.firstName} ${item?.user?.lastName}`}
              value={contentReply}
              onChange={(e) => setContentReply(e.target.value)}
              onKeyUp={async (e) => {
                if (e.code === "Enter") {
                  if (contentReply) {
                    await onSubmit(contentReply);
                    setContentReply("");
                  }
                }
              }}
            />
            <div className="text-sm flex items-center gap-2">
              <Button variant={"outline"} size={"sm"} onClick={onCancelReply}>
                Cancel
              </Button>
              <Button
                variant={"default"}
                size={"sm"}
                onClick={async () => {
                  if (contentReply) {
                    await onSubmit(contentReply);
                    setContentReply("");
                  }
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
        {/* comment */}
        {idsShowComment?.includes(item._id) && (
          <ListComment
            parent_id={parent_id}
            review_id={review_id}
            commentAdded={commentAdded}
          />
        )}
        {/* end comment */}
      </div>
    </div>
  );
};

export default ItemListComment;
