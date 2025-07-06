/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Rating, RatingButton } from "./ui/rating";
import { Textarea } from "./ui/textarea";
import ButtonLoading from "./ButtonLoading";
import { toast } from "sonner";
import { post } from "@/utils/requets";
import { ProductModel } from "@/models/productModel";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CommentModel, ReviewModel } from "@/models/reviewModel";
import { Button } from "./ui/button";
import ListComment from "./product/ListComment";
import { StarIcon } from "lucide-react";

interface Props {
  product?: ProductModel;
  reviews: ReviewModel[];
  onAddNewReview?: (val: ReviewModel) => void;
}

const RatingTab = (props: Props) => {
  const { product, reviews, onAddNewReview } = props;

  const [rateScore, setRateScore] = useState(0);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [idShowReply, setIdShowReply] = useState<string>(""); //only one - review_id
  const [idsShowComment, setIdsShowComment] = useState<string[]>([]); //review_id
  const [contentReply, setContentReply] = useState("");
  const [commentAdded, setCommentAdded] = useState<CommentModel>();

  const handleSubmitReview = async () => {
    setIsPosting(true);
    try {
      const response = await post("/reviews/create", {
        content,
        title,
        star: rateScore,
        product_id: product?._id || "",
      });
      console.log(response);
      if (onAddNewReview) {
        onAddNewReview(response.data);
      }
      toast.success(response.message, {
        description: "Posted reviews success",
        action: {
          label: "Close",
          onClick() {},
        },
        position: "top-center",
      });
      setContent("");
      setTitle("");
      setRateScore(0);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSubmitComment = async () => {
    try {
      const response = await post("/reviews/create-comment", {
        content: contentReply,
        review_id: idShowReply,
        parent_id: "",
        product_id: product?._id,
      });

      const comment: CommentModel = response.data;

      toast.success("Posted", {
        action: {
          label: "Close",
          onClick() {},
        },
        position: "top-center",
      });
      const ids = [...idsShowComment];
      if (!ids.includes(comment.review_id)) {
        ids.push(comment.review_id);
        setIdsShowComment(ids);
        setContentReply("");
        return;
      }

      setCommentAdded(comment);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-full py-5">
      <h3 className="font-bold">Customer Reviews</h3>
      {reviews && reviews?.length > 0 ? (
        <div className="my-6 flex flex-col gap-3">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="w-full space-y-2 border-b-2 border-muted pb-2 transition-all duration-300"
            >
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
                    onClick={() => {
                      if (idShowReply && idShowReply === item._id) {
                        setIdShowReply("");
                      } else {
                        setIdShowReply(item._id);
                      }
                      if (contentReply) {
                        setContentReply("");
                      }
                    }}
                  >
                    Reply
                  </Button>

                  {item?.countComment && item.countComment > 0 ? (
                    <>
                      <div className="h-full text-muted-foreground mx-1">|</div>
                      {!idsShowComment.includes(item._id) ? (
                        <Button
                          size={"sm"}
                          className="text-xs tracking-wider p-0 text-muted-foreground hover:text-black"
                          variant={"link"}
                          onClick={() => {
                            const ids = [...idsShowComment];
                            if (!ids.includes(item._id)) {
                              ids.push(item._id);
                            }
                            setIdsShowComment(ids);
                          }}
                        >
                          <p>Show {item.countComment} comment</p>
                        </Button>
                      ) : (
                        <Button
                          size={"sm"}
                          className="text-xs tracking-wider p-0 text-muted-foreground hover:text-black"
                          variant={"link"}
                          onClick={() => {
                            if (idsShowComment.includes(item._id)) {
                              setIdsShowComment(
                                idsShowComment.filter((it) => it !== item._id)
                              );
                            }
                          }}
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
                            await handleSubmitComment();
                          }
                        }
                      }}
                    />
                    <div className="text-sm flex items-center gap-2">
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => {
                          setIdShowReply("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant={"default"}
                        size={"sm"}
                        onClick={async () => {
                          if (contentReply) {
                            await handleSubmitComment();
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
                {/* comment */}
                {idsShowComment.includes(item._id) && (
                  <ListComment
                    parent_id={""}
                    review_id={item._id}
                    commentAdded={commentAdded}
                  />
                )}
                {/* end comment */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-10 text-muted-foreground">
          <p>Be the first to review this product.</p>
        </div>
      )}

      <div className="w-full py-6">
        <h3 className="font-bold">Add Your Review</h3>

        <div className="mt-4">
          <p className="text-sm">Your Rating</p>
          <Rating
            className="mt-1"
            onValueChange={(e) => {
              setRateScore(e);
            }}
            value={rateScore}
          >
            {Array.from({ length: 5 }).map((_, idx) => (
              <RatingButton
                key={idx}
                size={25}
                className="text-yellow-500"
                icon={<StarIcon strokeWidth={1} />}
                index={idx}
              />
            ))}
          </Rating>
        </div>

        <div className="mt-4 w-1/2">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-xs">
              Title
            </Label>
            <Input
              id="content"
              placeholder="Your title review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1 mt-4">
            <Label htmlFor="content" className="text-xs">
              Your Reviews
            </Label>
            <Textarea
              id="content"
              placeholder="Write something here..."
              className="min-h-50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <ButtonLoading
          loading={isPosting}
          disabled={!rateScore}
          className="px-10 py-6 mt-6"
          onClick={handleSubmitReview}
        >
          Submit
        </ButtonLoading>
      </div>
    </div>
  );
};

export default RatingTab;
