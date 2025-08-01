/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { del, get } from "@/utils/requets";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BlogModel } from "@/models/blogModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bookmark, Eye, Trash } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { toggleBlog } from "@/redux/reducer/favoriteReducer";
import lodash from "lodash";
import IMAGEDEFAULT from "../../../assets/imagenotfound.png";

const BlogSaved = () => {
  const [blogs, setBlogs] = useState<BlogModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [rollback, setRollback] = useState<BlogModel[]>();

  const dispatch = useDispatch();

  useEffect(() => {
    getSavedBlogs();
  }, []);

  useEffect(() => {
    if (rollback && rollback.length > 0) {
      const items = [];
      for (const blog of blogs) {
        const roll = rollback.find((item) => item._id === blog._id);
        if (roll) {
          items.push(blog);
        } else if (!deleted.includes(blog._id)) {
          items.push(blog);
        }
      }
      setBlogs(items);
      setRollback([]);
      setDeleted([]);
    }
  }, [rollback]);

  const getSavedBlogs = async () => {
    try {
      setLoading(true);
      const response = await get("/favorites/blogs-info");
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching saved blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRemoveBlog = async (blog_ids: string[], blogs: BlogModel[]) => {
    const success: string[] = [];
    try {
      for (const id of blog_ids) {
        await del("/favorites/remove-blog", id);
        success.push(id);
      }
      setBlogs(blogs.filter((item) => !success.includes(item._id)));
      for (const id of success) {
        dispatch(toggleBlog(id));
      }

      setDeleted([]);
    } catch (error: any) {
      const items = blog_ids.filter((item) => !success.includes(item));
      const data = blogs.filter((item) => items.includes(item._id));
      setRollback(data);
      setDeleted(success);
      toast.error(error.message);
    }
  };

  const debounceDelete = useRef(
    lodash.debounce((blog_ids: string[], blogs: BlogModel[]) => {
      handleRemoveBlog(blog_ids, blogs);
    }, 500)
  ).current;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-80 sm:h-48 h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                    <div className="flex space-x-2 mb-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No saved blogs found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Please save your favorite blog posts to read later!
            </p>
            <Link href={"/blogs"} className="">
              <Button>Go to Blog Page</Button>
            </Link>
          </div>
        ) : (
          <div className="transition-all duration-300 relative">
            {blogs.map((blog) => (
              <div
                data-id={`${blog._id}`}
                key={blog._id}
                className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-gray-200 dark:border-gray-700 data-[deleted='false']:mb-6 data-[deleted='false']:border transform data-[deleted='true']:-translate-x-full data-[deleted='true']:opacity-0 data-[deleted='true']:pointer-events-none data-[deleted='true']:max-h-0 data-[rollback=true]:opacity-100 data-[rollback=true]:translate-x-0 data-[deleted='false']:md:max-h-80 data-[deleted='false']:max-h-100`}
                data-deleted={deleted.includes(blog._id) ? "true" : "false"}
                data-rollback={
                  rollback?.find((item) => item._id === blog._id)
                    ? "true"
                    : "false"
                }
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Blog Image */}
                  {blog.image && (
                    <div className="sm:w-80 h-auto flex-shrink-0 overflow-hidden relative sm:block hidden">
                      <Image
                        src={blog.image || IMAGEDEFAULT}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 pr-4">
                        {blog.title}
                      </h3>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <Bookmark className="w-3 h-3 mr-1" />
                          Đã lưu
                        </span>
                      </div>
                    </div>

                    <p
                      className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{
                        __html: blog.content.replace(/<[^>]*>/g, ""),
                      }}
                    ></p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {blog.tags.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{blog.tags.length - 4} khác
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Author */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {blog.author.avatar ? (
                            <div className="w-8 h-8 relative rounded-full overflow-hidden">
                              <Image
                                src={blog.author.avatar}
                                alt={blog?.author?.fullName || "Unknown Author"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {blog?.author?.fullName
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {blog?.author?.fullName}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(blog.createdAt)}
                        </span>
                      </div>

                      <div className="flex space-x-3">
                        <Link href={`/blogs/${blog.slug}`} className="">
                          <Button className="">
                            <Eye />
                            <span>Đọc bài viết</span>
                          </Button>
                        </Link>
                        <button
                          onClick={() => {
                            setDeleted([...deleted, blog._id]);
                            debounceDelete([...deleted, blog._id], blogs);
                          }}
                          className="dark:bg-red-700 dark:hover:bg-red-800 dark:text-white/80 hover:bg-red-200 bg-red-100 text-red-600 p-2 rounded-md transition-colors duration-200 flex items-center justify-center"
                          title="Bỏ lưu"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogSaved;
