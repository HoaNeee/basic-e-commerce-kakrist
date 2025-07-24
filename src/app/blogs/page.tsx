"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, Tag, Search } from "lucide-react";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "10 Xu hướng thời trang mùa hè 2024",
    excerpt:
      "Khám phá những xu hướng thời trang hot nhất mùa hè này với các gam màu tươi sáng và phong cách thoải mái.",
    content:
      "Mùa hè 2024 đang đến gần, và thế giới thời trang đang chào đón những xu hướng mới đầy hứa hẹn...",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    author: "Nguyễn Văn A",
    publishedAt: "2024-06-15",
    readTime: "5 phút",
    category: "Thời trang",
    tags: ["xu hướng", "thời trang", "mùa hè"],
  },
  {
    id: 2,
    title: "Cách phối đồ công sở thanh lịch",
    excerpt:
      "Hướng dẫn chi tiết cách phối đồ công sở chuyên nghiệp và thanh lịch cho phái nữ hiện đại.",
    content:
      "Trong môi trường công sở ngày nay, việc ăn mặc không chỉ thể hiện cá tính mà còn...",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    author: "Trần Thị Hoa",
    publishedAt: "2024-06-10",
    readTime: "7 phút",
    category: "Phong cách",
    tags: ["công sở", "phong cách", "chuyên nghiệp"],
  },
  {
    id: 3,
    title: "Chăm sóc quần áo để bền đẹp",
    excerpt:
      "Những mẹo hay giúp bạn bảo quản quần áo luôn như mới và kéo dài tuổi thọ sử dụng.",
    content:
      "Việc chăm sóc quần áo đúng cách không chỉ giúp trang phục luôn đẹp mà còn...",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    author: "Lê Văn Nam",
    publishedAt: "2024-06-05",
    readTime: "4 phút",
    category: "Chăm sóc",
    tags: ["chăm sóc", "bảo quản", "mẹo hay"],
  },
  {
    id: 4,
    title: "Màu sắc và tâm lý trong thời trang",
    excerpt:
      "Tìm hiểu về tác động của màu sắc đến tâm lý và cách sử dụng màu sắc hiệu quả trong trang phục.",
    content:
      "Màu sắc có một sức mạnh kỳ diệu trong việc ảnh hưởng đến tâm trạng và cảm xúc...",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop",
    author: "Phạm Thu Hằng",
    publishedAt: "2024-05-28",
    readTime: "6 phút",
    category: "Tâm lý",
    tags: ["màu sắc", "tâm lý", "phong cách"],
  },
  {
    id: 5,
    title: "Thời trang bền vững - Xu hướng tương lai",
    excerpt:
      "Khám phá phong trào thời trang bền vững và cách chúng ta có thể đóng góp vào việc bảo vệ môi trường.",
    content:
      "Trong bối cảnh biến đổi khí hậu ngày càng nghiêm trọng, ngành thời trang...",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop",
    author: "Hoàng Minh Đức",
    publishedAt: "2024-05-20",
    readTime: "8 phút",
    category: "Bền vững",
    tags: ["bền vững", "môi trường", "tương lai"],
  },
  {
    id: 6,
    title: "Phụ kiện thời trang không thể thiếu",
    excerpt:
      "Những phụ kiện thiết yếu giúp hoàn thiện phong cách và tạo điểm nhấn cho trang phục.",
    content:
      "Phụ kiện chính là linh hồn của trang phục, giúp biến một bộ đồ đơn giản...",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=400&fit=crop",
    author: "Vũ Thị Lan",
    publishedAt: "2024-05-15",
    readTime: "5 phút",
    category: "Phụ kiện",
    tags: ["phụ kiện", "trang sức", "túi xách"],
  },
];

const categories = [
  "Tất cả",
  "Thời trang",
  "Phong cách",
  "Chăm sóc",
  "Tâm lý",
  "Bền vững",
  "Phụ kiện",
];

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog Thời Trang
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những xu hướng mới nhất, mẹo hay và cảm hứng thời trang
              từ các chuyên gia
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  <Link href={`/blogs/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center mr-4">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center mr-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read More Button */}
                <Link
                  href={`/blogs/${post.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
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
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Không tìm thấy bài viết
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
            </p>
          </div>
        )}

        {/* Pagination would go here */}
        {filteredPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Trước
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
