/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Rating, RatingButton } from "./ui/rating";
import { Textarea } from "./ui/textarea";
import ButtonLoading from "./ButtonLoading";
import { toast } from "sonner";
import { del, post, postImageMulti } from "@/utils/requets";
import { ProductModel } from "@/models/productModel";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CommentModel, ReviewModel } from "@/models/reviewModel";
import { StarIcon, Upload, X } from "lucide-react";
import ItemListComment from "./product/ItemListComment";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "./ui/file-upload";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  product?: ProductModel;
  reviews: ReviewModel[];
  onAddNewReview?: (val: ReviewModel) => void;
  onDeleteReview?: (val: ReviewModel) => void;
  onShowMore?: () => void;
  loading?: boolean;
  disabledShowMore?: boolean;
}

const RatingTab = (props: Props) => {
  const {
    product,
    reviews,
    onAddNewReview,
    onDeleteReview,
    onShowMore,
    loading,
    disabledShowMore,
  } = props;

  const [rateScore, setRateScore] = useState(0);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [idShowReply, setIdShowReply] = useState<string>(""); //only one - review_id
  const [idsShowComment, setIdsShowComment] = useState<string[]>([]); //review_id
  const [commentAdded, setCommentAdded] = useState<CommentModel>();
  const [files, setFiles] = useState<File[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);

  const handleSubmitReview = async () => {
    setIsPosting(true);
    const payload: any = {
      content,
      title,
      star: rateScore,
      product_id: product?._id || "",
    };
    try {
      if (files && files.length > 0) {
        const response = await postImageMulti("images", files);
        payload["images"] = response.data;
      }

      const response = await post("/reviews/create", payload);

      if (onAddNewReview) {
        onAddNewReview({
          ...response.data,
          user: {
            firstName: auth.firstName,
            lastName: auth.lastName,
            avatar: auth.avatar,
          },
        });
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
      setFiles([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSubmitComment = async (content: string) => {
    try {
      const response = await post("/reviews/create-comment", {
        content: content,
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
        return;
      }

      setCommentAdded(comment);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteReview = async (item: ReviewModel) => {
    setIsDeleting(true);
    try {
      const response = await del("/reviews/delete", item._id);
      toast.success(response.message, {
        description: "That review was be remove",
        action: {
          label: "Close",
          onClick() {},
        },
      });
      if (onDeleteReview) {
        onDeleteReview(item);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
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
              <ItemListComment
                item={item}
                onSubmit={async (val: string) => {
                  await handleSubmitComment(val);
                }}
                commentAdded={commentAdded}
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
                parent_id={""}
                review_id={item._id}
                isUser={auth.user_id === item.user_id}
                onDelete={(val) => {
                  handleDeleteReview(val);
                }}
                loading={isDeleting}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-10 text-muted-foreground">
          <p>Be the first to review this product.</p>
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <div className="md:w-1/3 sm:w-1/2 w-full">
          <ButtonLoading
            loading={loading}
            onClick={() => {
              if (onShowMore) {
                onShowMore();
              }
            }}
            className="px-10 w-full"
            disabled={disabledShowMore}
          >
            Show More
          </ButtonLoading>
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

        <div className="mt-4 md:w-1/2 w-full">
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
          <FileUpload
            value={files}
            onValueChange={setFiles}
            accept="image/*"
            maxFiles={5}
            className="w-full max-w-xs mt-6"
            multiple
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (max 5 files)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList orientation="horizontal" className="gap-3">
              {files.map((file, index) => (
                <FileUploadItem
                  key={index}
                  value={file}
                  className="p-0 border-none relative"
                >
                  <FileUploadItemPreview
                    className="h-20 w-20"
                    render={() => {
                      return (
                        <div className="relative w-full h-full">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="this is image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    }}
                  />
                  <div className="absolute -top-2.5 -right-3 bg-muted rounded-full">
                    <FileUploadItemDelete
                      asChild
                      className="hover:rounded-full"
                      title="Remove this file"
                    >
                      <Button variant="ghost" size="icon" className="size-7">
                        <X />
                      </Button>
                    </FileUploadItemDelete>
                  </div>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
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
