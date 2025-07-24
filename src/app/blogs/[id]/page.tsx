"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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

// Sample blog detail data
const blogPost = {
  id: 1,
  title: "10 Xu hướng thời trang mùa hè 2024",
  excerpt:
    "Khám phá những xu hướng thời trang hot nhất mùa hè này với các gam màu tươi sáng và phong cách thoải mái.",
  content: `
    <p>Mùa hè 2024 đang đến gần, và thế giới thời trang đang chào đón những xu hướng mới đầy hứa hẹn. Từ các gam màu tươi sáng đến những phong cách thoải mái, mùa hè này hứa hẹn sẽ mang đến sự đa dạng và phong phú trong lựa chọn trang phục.</p>

    <h2>1. Gam màu Pastel nhẹ nhàng</h2>
    <p>Các tông màu pastel như hồng nhạt, xanh mint, và vàng kem đang trở thành xu hướng chủ đạo. Những màu sắc này không chỉ tạo cảm giác mát mẻ mà còn rất dễ phối đồ.</p>

    <h2>2. Phong cách Oversized thoải mái</h2>
    <p>Quần áo rộng rãi, thoải mái tiếp tục được ưa chuộng. Từ áo thun oversized đến quần short rộng, phong cách này vừa thoải mái vừa thời trang.</p>

    <h2>3. Họa tiết hoa nhiệt đới</h2>
    <p>Các motif hoa lá nhiệt đới sẽ là điểm nhấn đặc biệt cho mùa hè này. Từ váy maxi đến áo sơ mi, họa tiết này mang lại cảm giác tươi mới và năng động.</p>

    <h2>4. Chất liệu linen tự nhiên</h2>
    <p>Linen với đặc tính thoáng mát và thân thiện với môi trường đang ngày càng được ưa chuộng. Chất liệu này phù hợp với xu hướng thời trang bền vững.</p>

    <h2>5. Phụ kiện đan lát</h2>
    <p>Túi xách đan lát, mũ cói và giày sandal đan dây sẽ là những phụ kiện không thể thiếu cho mùa hè này.</p>

    <p>Những xu hướng này không chỉ mang lại sự thoải mái trong thời tiết nóng mà còn thể hiện cá tính riêng của mỗi người. Hãy lựa chọn những item phù hợp với phong cách và sở thích của bạn để tạo nên bộ trang phục hoàn hảo cho mùa hè 2024.</p>
  `,
  image:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  author: "Nguyễn Minh Anh",
  publishedAt: "2024-06-15",
  readTime: "5 phút",
  category: "Thời trang",
  tags: ["xu hướng", "thời trang", "mùa hè"],
  likes: 124,
  views: 1520,
};

const relatedPosts = [
  {
    id: 2,
    title: "Cách phối đồ công sở thanh lịch",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
    category: "Phong cách",
  },
  {
    id: 3,
    title: "Chăm sóc quần áo để bền đẹp",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    category: "Chăm sóc",
  },
  {
    id: 4,
    title: "Màu sắc và tâm lý trong thời trang",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop",
    category: "Tâm lý",
  },
];

const BlogDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/blogs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại danh sách blog
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {blogPost.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6">{blogPost.excerpt}</p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {blogPost.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(blogPost.publishedAt).toLocaleDateString("vi-VN")}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {blogPost.readTime}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {blogPost.views.toLocaleString()} lượt xem
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Heart className="w-4 h-4" />
                Thích ({blogPost.likes})
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <BookmarkPlus className="w-4 h-4" />
                Lưu
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={blogPost.image}
              alt={blogPost.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Tags:
              </span>
              {blogPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                {blogPost.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {blogPost.author}
                </h3>
                <p className="text-gray-600">
                  Fashion Blogger & Style Consultant
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Chuyên gia tư vấn thời trang với hơn 5 năm kinh nghiệm trong
                  ngành.
                </p>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Bài viết liên quan
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.id}`}
                  className="group"
                >
                  <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
