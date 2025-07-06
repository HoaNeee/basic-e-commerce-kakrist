/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Rating, RatingButton } from "../ui/rating";
import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ListComment from "./ListComment";
import { CommentModel, ReviewModel } from "@/models/reviewModel";

interface Props {
  item: ReviewModel | CommentModel | any;
  onShowReply?: () => void;
  idsShowComment?: string[];
  idShowReply?: string;
  onSubmit: () => Promise<void>;
  commentAdded?: CommentModel;
  isComment?: boolean;
  onShowComment?: () => void;
  onHideComment?: () => void;
  onCancelReply?: () => void;
  review_id?: string;
  parent_id?: string;
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
  } = props;

  const [contentReply, setContentReply] = useState("");

  return (
    <div className="w-full space-y-2 border-b-2 border-muted pb-2 transition-all duration-300">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={
              item.user?.avatar ??
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRadJ-YmNxJTg6v9iO22fzR_65KenYJHFB5zg&s"
            }
            alt="avatar"
          />
          <AvatarFallback>CN</AvatarFallback>
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
                        ? "text-yellow-500"
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
      <div className="space-y-1">
        <p className="font-bold">{item.title}</p>
        <p className="tracking-wider text-sm">{item.content}</p>
      </div>
      <div>
        <div className="text-xs tracking-wider text-muted-foreground flex items-center">
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
              placeholder="replying @name"
              value={contentReply}
              onChange={(e) => setContentReply(e.target.value)}
              onKeyUp={async (e) => {
                if (e.code === "Enter") {
                  if (contentReply) {
                    await onSubmit();
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
                    await onSubmit();
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
