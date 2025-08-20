/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Heart,
  BookmarkPlus,
  Eye,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BlogModel } from "@/models/blogModel";
import { get, patch } from "@/utils/requets";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import lodash from "lodash";
import {
  handleToggleBlog,
  listFavoriteToggle,
  toggleBlog,
} from "@/redux/reducer/favoriteReducer";
import { toast } from "sonner";
import IMAGEDEFAULT from "../../../assets/imagenotfound.png";

const BlogDetail = () => {
  const [blog, setBlog] = useState<BlogModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogModel[]>([]);

  const params = useParams();
  const slug = params.slug as string;
  const auth = useSelector((state: RootState) => state.auth.auth);
  const listBlogSaved = useSelector(
    (state: RootState) => state.favorite.listBlog
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleAction = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          getBlogDetail(),
          getRelatedBlogs(),
          handleRead(slug),
        ]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    handleAction();
  }, [slug]);

  const getBlogDetail = async () => {
    if (!slug) return;
    const response = await get(`/blogs/detail/${slug}`);
    setBlog({
      ...response.data,
      likedLength: response.data.liked.length,
    });
  };

  const getRelatedBlogs = async () => {
    if (!slug) return [];
    const response = await get(`/blogs/related/${slug}`);
    setRelatedBlogs(response.data);
  };

  const handleRead = async (slug: string) => {
    if (!slug) return;
    await get(`/blogs/read/${slug}`);
  };

  const debounceToggleFavorite = useRef(
    lodash.debounce((list: string[]) => handleToggleBlog(list), 500)
  ).current;

  const handleFavorite = async (blog_id: string) => {
    try {
      const next = `/blogs/${slug}`;
      if (!auth.isLogin) {
        window.location.href = "/auth/login?next=" + next;
        return;
      }
      dispatch(toggleBlog(blog_id));
      const list = listFavoriteToggle(listBlogSaved, blog_id);
      debounceToggleFavorite(list);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!blog || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mt-10 h-fulll flex flex-col gap-5">
              <Skeleton className="h-5 w-15" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
              </div>
              <Skeleton className="h-4 md:w-1/2 w-full" />
              <Skeleton className="h-12 md:w-1/2 w-full" />
              <Skeleton className="h-96 w-full mt-8" />
              <Skeleton className="mt-10 w-2/3 h-8" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-30 w-full my-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLikeBlog = async () => {
    if (!slug) return;

    if (!auth.isLogin) {
      const next = `/blogs/${slug}`;
      window.location.href = `/auth/login?next=${encodeURIComponent(next)}`;
      return;
    }

    try {
      const api = `/blogs/like/${slug}`;
      const user_id = auth.user_id;

      let liked = blog.liked || [];
      let likedLength = blog.likedLength || 0;
      if (liked.includes(user_id)) {
        likedLength -= 1;
        liked = liked.filter((id) => id !== user_id);
        setBlog({
          ...blog,
          liked: liked,
          likedLength,
        });
      } else {
        likedLength += 1;
        liked = [...liked, user_id];
        setBlog({
          ...blog,
          liked: liked,
          likedLength,
        });
      }
      const response = await patch(api, { user_id: user_id });
      if (response.data.likedLength !== likedLength) {
        setBlog({
          ...blog,
          liked: liked,
          likedLength: response.data.likedLength,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="bg-white border-b dark:border-neutral-700 dark:bg-neutral-800">
          <div className="container mx-auto px-4 py-4">
            <div
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-white/80 dark:hover:text-white/100 transition-colors cursor-pointer"
              onClick={() => {
                router.back();
              }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </div>
          </div>
        </div>

        <article className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="mb-4">
                <span className="bg-black text-white dark:bg-neutral-700 px-3 py-1 capitalize rounded-full text-sm font-medium">
                  {blog?.tags && blog.tags.length > 0 && blog.tags[0]}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white/80 mb-6 leading-tight">
                {blog?.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-white/60 mb-6">
                {blog?.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-white/60 mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {blog?.author.fullName || "Unknown Author"}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(blog?.createdAt || new Date()).toLocaleDateString(
                    "vi-VN"
                  )}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {blog.readTime} phút đọc
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {(blog?.view || 0) + 1} lượt xem
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pb-6 border-b flex-wrap">
                <button
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-800/80 dark:text-white rounded-lg hover:bg-red-100 transition-colors dark:hover:bg-red-700"
                  onClick={handleLikeBlog}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={
                      !auth.isLogin
                        ? "none"
                        : blog?.liked?.includes(auth.user_id)
                        ? "red"
                        : "none"
                    }
                  />
                  {!auth.isLogin
                    ? "Thích"
                    : blog.liked.includes(auth.user_id)
                    ? "Đã thích"
                    : "Thích"}{" "}
                  ({blog?.likedLength || 0})
                </button>
                <button
                  onClick={() => {
                    handleFavorite(blog._id);
                  }}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-white rounded-lg hover:bg-blue-100 dark:hover:bg-blue-700 transition-all duration-300"
                >
                  <BookmarkPlus
                    className="w-4 h-4"
                    fill={
                      !auth.isLogin
                        ? "none"
                        : listBlogSaved.includes(blog._id)
                        ? "blue"
                        : "none"
                    }
                  />
                  {listBlogSaved.includes(blog._id) ? "Đã lưu" : "Lưu"}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-white rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </button>
              </div>
            </header>

            <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
              <Image
                src={blog.image || IMAGEDEFAULT}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm mb-8 dark:bg-neutral-800 dark:text-white/80">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed dark"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                  Tags:
                </span>
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-neutral-600 dark:text-white/80 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm mb-8">
              <div className="flex items-center">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {blog.author.fullName.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white/80">
                    {blog.author.fullName}
                  </h3>
                  <p className="text-gray-600 dark:text-white/70">
                    Fashion Blogger & Style Consultant
                  </p>
                  <p className="text-sm text-gray-500 mt-1 dark:text-white/60">
                    Chuyên gia tư vấn thời trang với hơn 5 năm kinh nghiệm trong
                    ngành.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white rounded-xl p-8 shadow-sm dark:bg-neutral-800 dark:text-white/80">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white/80 mb-6">
                Bài viết liên quan
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/blogs/${blog.slug}`}
                    className="group"
                    aria-label={blog.title}
                  >
                    <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={blog.image || IMAGEDEFAULT}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          {blog?.tags && blog.tags.length > 0 && blog.tags[0]}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white/80 dark:group-hover:text-blue-400 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogDetail;
