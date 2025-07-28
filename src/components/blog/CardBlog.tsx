/* eslint-disable @next/next/no-img-element */
import { BlogModel } from "@/models/blogModel";
import { Calendar, Clock, Tag, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import IMAGEDEFAULT from "../../assets/imagenotfound.png";
import Image from "next/image";

const CardBlog = ({ blog }: { blog: BlogModel }) => {
  return (
    <article
      key={blog._id}
      className="bg-white dark:bg-neutral-800 dark:text-white/80 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={blog.image || IMAGEDEFAULT}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-black text-white px-3 py-1.5 capitalize rounded-full text-xs font-medium">
            {blog.tags && blog.tags?.length > 0 ? blog.tags[0] : "General"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white/80 mb-3 group-hover:text-blue-600 transition-colors">
          <Link href={`/blogs/${blog.slug}`} className="hover:underline">
            {blog.title}
          </Link>
        </h2>

        <p className="text-gray-600 dark:text-white/60 mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center text-sm text-gray-500 dark:text-white/60 mb-4">
          <div className="flex items-center mr-4">
            <User className="w-4 h-4 mr-1" />
            {blog.author?.fullName || "Unknown Author"}
          </div>
          <div className="flex items-center mr-4">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {blog.readTime}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-600 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-neutral-500 transition-colors"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        {/* Read More Button */}
        <Link
          href={`/blogs/${blog.slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors"
        >
          Đọc thêm
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default CardBlog;
