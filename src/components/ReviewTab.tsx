/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Rating, RatingButton } from "./ui/rating";
import { Textarea } from "./ui/textarea";
import ButtonLoading from "./ButtonLoading";
import { toast } from "sonner";
import { del, get, post, postImageMulti } from "@/utils/requets";
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
import { usePathname, useSearchParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

interface Props {
  product?: ProductModel;
}

const RatingTab = (props: Props) => {
  const { product } = props;

  const [rateScore, setRateScore] = useState(0);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [idShowReply, setIdShowReply] = useState<string>(""); //only one - review_id
  const [idsShowComment, setIdsShowComment] = useState<string[]>([]); //review_id
  const [commentAdded, setCommentAdded] = useState<CommentModel>();
  const [files, setFiles] = useState<File[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [pageReview, setPageReview] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newReviews, setNewReviews] = useState<ReviewModel[]>([]);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isSubmitingComment, setIsSubmitingComment] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);
  const path = usePathname();
  const search = useSearchParams().toString();
  const limit = 3;

  useEffect(() => {
    if (product) {
      getReviews(product._id);
    }
  }, [product]);

  useEffect(() => {
    if (pageReview !== 1 && product) {
      showMoreReviews(product._id, pageReview);
    }
  }, [pageReview]);

  useEffect(() => {
    if (newReviews.length > 0 && !isLoading) {
      setReviews([...reviews, ...newReviews]);
    }
  }, [newReviews, isLoading]);

  const getReviews = async (product_id: string) => {
    try {
      setIsFirstLoading(true);
      const response = await get(
        `/reviews?product_id=${product_id}&limit=${limit}&page=1`
      );
      setReviews(response.data.reviews);
      setTotalReviews(response.data.totalRecord);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFirstLoading(false);
    }
  };

  const showMoreReviews = async (product_id: string, page = 1) => {
    try {
      setIsLoading(true);
      const response = await get(
        `/reviews?product_id=${product_id}&limit=${limit}&page=${page}`
      );
      setNewReviews(response.data.reviews);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

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

      setReviews([
        ...reviews,
        {
          ...response.data,
          user: {
            firstName: auth.firstName,
            lastName: auth.lastName,
            avatar: auth.avatar,
          },
        },
      ]);

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
      if (!content || content.trim() === "") {
        toast.error("Please enter your comment content");
        return;
      }
      setIsSubmitingComment(true);
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
    } finally {
      setIsSubmitingComment(false);
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
      setReviews(reviews.filter((rv) => rv._id !== item._id));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderSkeleton = () => {
    return (
      <>
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4"
          >
            <div className="flex gap-4 items-start">
              <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4 rounded" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-5 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  if (isFirstLoading) {
    return (
      <div className="py-8">
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">{renderSkeleton()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Customer Reviews ({totalReviews})
        </h3>

        {reviews && reviews?.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
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
                  isSubmitingComment={isSubmitingComment}
                />
              </div>
            ))}

            {isLoading && <div className="space-y-4">{renderSkeleton()}</div>}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-12 text-center">
            <div className="text-gray-400 text-lg mb-2">No reviews yet</div>
            <p className="text-gray-500 text-sm">
              Be the first to share your thoughts about this product!
            </p>
          </div>
        )}

        {reviews && reviews.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => {
                if (!isLoading) {
                  setPageReview(pageReview + 1);
                }
              }}
              className="px-8 py-2.5"
              variant="outline"
              disabled={
                pageReview >= Math.ceil(totalReviews / limit) || isLoading
              }
            >
              {isLoading ? "Loading..." : "Show More Reviews"}
            </Button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Write a Review
        </h3>

        {!auth.isLogin ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Please log in to write a review
            </p>
            <a
              href={`/auth/login?next=${encodeURIComponent(
                path + (search ? `?${search}` : ``)
              )}`}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200"
            >
              Log In to Review
            </a>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Your Rating *
              </Label>
              <div className="flex items-center justify-center sm:justify-start">
                <Rating
                  onValueChange={(e) => {
                    setRateScore(e);
                  }}
                  value={rateScore}
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <RatingButton
                      key={idx}
                      size={32}
                      className={`${
                        idx < rateScore
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-300 hover:text-yellow-400"
                      } transition-colors duration-200`}
                      icon={
                        <StarIcon
                          strokeWidth={1}
                          fill={idx < rateScore ? "currentColor" : "none"}
                        />
                      }
                      index={idx}
                    />
                  ))}
                </Rating>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Review Title
                </Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="content"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Review
              </Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts about this product..."
                className="min-h-32 border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Photos (Optional)
              </Label>
              <FileUpload
                value={files}
                onValueChange={setFiles}
                accept="image/*"
                maxFiles={5}
                className="w-full"
                multiple
              >
                <FileUploadDropzone className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors duration-200">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600">
                      <Upload className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        Drag & drop photos here
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        or click to browse (max 5 images)
                      </p>
                    </div>
                    <FileUploadTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose Files
                      </Button>
                    </FileUploadTrigger>
                  </div>
                </FileUploadDropzone>

                {files.length > 0 && (
                  <FileUploadList
                    orientation="horizontal"
                    className="gap-4 mt-4"
                  >
                    {files.map((file, index) => (
                      <FileUploadItem
                        key={index}
                        value={file}
                        className="relative group"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                          <FileUploadItemPreview
                            className="w-full h-full"
                            render={() => (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Review image"
                                className="w-full h-full object-cover"
                              />
                            )}
                          />
                          <FileUploadItemDelete
                            asChild
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Button
                              variant="destructive"
                              size="icon"
                              className="w-6 h-6 rounded-full"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </FileUploadItemDelete>
                        </div>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                )}
              </FileUpload>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <ButtonLoading
                loading={isPosting}
                disabled={!rateScore}
                className="px-8 py-2.5 min-w-32"
                onClick={handleSubmitReview}
              >
                {isPosting ? "Publishing..." : "Publish Review"}
              </ButtonLoading>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingTab;
