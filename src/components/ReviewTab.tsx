/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { del, get, post, postImageMulti } from "@/utils/requets";
import { ProductModel } from "@/models/productModel";
import { CommentModel, ReviewModel } from "@/models/reviewModel";
import ItemListComment from "./product/ItemListComment";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname, useSearchParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import PostReview from "./PostReview";

interface Props {
  product?: ProductModel;
}

const RatingTab = (props: Props) => {
  const { product } = props;

  const [idShowReply, setIdShowReply] = useState<string>(""); //only one - review_id
  const [idsShowComment, setIdsShowComment] = useState<string[]>([]); //review_id
  const [commentAdded, setCommentAdded] = useState<CommentModel>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [pageReview, setPageReview] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newReviews, setNewReviews] = useState<ReviewModel[]>([]);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isSubmitingComment, setIsSubmitingComment] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isResetFormReview, setIsResetFormReview] = useState(false);

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

  const handleSubmitReview = async (data: {
    rateScore: number;
    title: string;
    content: string;
    files: File[];
  }) => {
    if (!product) {
      return;
    }

    try {
      setIsPosting(true);
      const payload: any = {
        content: data.content,
        title: data.title,
        star: data.rateScore,
      };
      if (data.files && data.files.length > 0) {
        const response = await postImageMulti("images", data.files);
        payload["images"] = response.data;
      }

      const response = await post(`/reviews/create/${product._id}`, payload);
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
      setIsResetFormReview(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPosting(false);
    }
  };

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

  const handleSubmitComment = async (content: string) => {
    try {
      if (!content || content.trim() === "") {
        toast.error("Please enter your comment content");
        return;
      }
      setIsSubmitingComment(true);
      const response = await post(`/reviews/create-comment/${idShowReply}`, {
        content: content,
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
            className="dark:bg-gray-800/50 dark:border-gray-700 p-6 space-y-4 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex items-start gap-4">
              <Skeleton className="flex-shrink-0 w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="w-32 h-4" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4 rounded" />
                    ))}
                  </div>
                </div>
                <Skeleton className="w-3/4 h-5" />
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-5/6 h-4" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
                <Skeleton className="w-24 h-3" />
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
          <Skeleton className="w-48 h-6 mb-6" />
          <div className="space-y-4">{renderSkeleton()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="dark:text-white mb-6 text-xl font-bold text-gray-900">
          Customer Reviews ({totalReviews})
        </h3>

        {reviews && reviews?.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((item, index) => (
              <div
                key={index}
                className="dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-md p-6 transition-all duration-200 bg-white border border-gray-200 rounded-lg"
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
          <div className="bg-gray-50 dark:bg-gray-800/30 p-12 text-center rounded-lg">
            <div className="mb-2 text-lg text-gray-400">No reviews yet</div>
            <p className="text-sm text-gray-500">
              Be the first to share your thoughts about this product!
            </p>
          </div>
        )}

        {reviews && reviews.length > 0 && (
          <div className="flex justify-center mt-6">
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

      <div className="dark:border-gray-700 pt-8 border-t border-gray-200">
        <h3 className="dark:text-white mb-6 text-xl font-bold text-gray-900">
          Write a Review
        </h3>

        {!auth.isLogin ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 text-center rounded-lg">
            <p className="dark:text-gray-400 mb-3 text-gray-600">
              Please log in to write a review
            </p>
            <a
              href={`/auth/login?next=${encodeURIComponent(
                path + (search ? `?${search}` : ``)
              )}`}
              className="bg-primary hover:bg-primary/90 inline-flex items-center px-4 py-2 text-white transition-colors duration-200 rounded-md"
            >
              Log In to Review
            </a>
          </div>
        ) : (
          <div className="dark:bg-gray-800/50 dark:border-gray-700 p-6 space-y-6 bg-white border border-gray-200 rounded-lg">
            <PostReview
              isPosting={isPosting}
              onSubmit={(data: any) => {
                handleSubmitReview(data);
              }}
              isResetForm={isResetFormReview}
              setIsResetFormReview={setIsResetFormReview}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingTab;
