"use client";

import React from "react";
import Image from "next/image";
import {
  Heart,
  Users,
  Award,
  Globe,
  Sparkles,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
  CheckCircle,
} from "lucide-react";

const Stories = () => {
  const milestones = [
    {
      year: "2019",
      title: "Khởi đầu với một ước mơ",
      description:
        "Bắt đầu từ một cửa hàng nhỏ với niềm đam mê thời trang và mong muốn mang đến phong cách cho mọi người.",
    },
    {
      year: "2020",
      title: "Mở rộng online",
      description:
        "Ra mắt website thương mại điện tử, phục vụ khách hàng trên toàn quốc trong thời kỳ đại dịch.",
    },
    {
      year: "2021",
      title: "10,000+ khách hàng",
      description:
        "Đạt mốc 10,000 khách hàng tin tưởng và trở thành thương hiệu được yêu thích.",
    },
    {
      year: "2022",
      title: "Mở rộng sản phẩm",
      description:
        "Thêm nhiều dòng sản phẩm mới và hợp tác với các nhà thiết kế nổi tiếng.",
    },
    {
      year: "2023",
      title: "Thời trang bền vững",
      description:
        "Cam kết sử dụng chất liệu thân thiện môi trường và quy trình sản xuất bền vững.",
    },
    {
      year: "2024",
      title: "Tương lai rộng mở",
      description:
        "Tiếp tục đổi mới và mở rộng để phục vụ khách hàng tốt hơn mỗi ngày.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Đam Mê",
      description:
        "Chúng tôi yêu thích thời trang và luôn đặt tình yêu này vào từng sản phẩm",
      color: "text-red-500 bg-red-50",
    },
    {
      icon: Users,
      title: "Khách Hàng Là Trung Tâm",
      description:
        "Mọi quyết định đều hướng đến việc mang lại trải nghiệm tốt nhất cho khách hàng",
      color: "text-blue-500 bg-blue-50",
    },
    {
      icon: Award,
      title: "Chất Lượng",
      description: "Cam kết chỉ cung cấp những sản phẩm chất lượng cao nhất",
      color: "text-yellow-500 bg-yellow-50",
    },
    {
      icon: Globe,
      title: "Bền Vững",
      description:
        "Bảo vệ môi trường qua các sản phẩm và quy trình sản xuất xanh",
      color: "text-green-500 bg-green-50",
    },
  ];

  const teamMembers = [
    {
      name: "Nguyễn Văn A",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b332c913?w=300&h=300&fit=crop&crop=face",
      description:
        "Với hơn 10 năm kinh nghiệm trong ngành thời trang, Nguyễn Văn A đã xây dựng thương hiệu từ con số 0.",
    },
    {
      name: "Trần Thị B",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description:
        "Chuyên gia thiết kế với tầm nhìn độc đáo, tạo nên những bộ sưu tập ấn tượng.",
    },
    {
      name: "Lê Thị C",
      role: "Head of Marketing",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description:
        "Đứng sau những chiến dịch marketing sáng tạo và kết nối với khách hàng.",
    },
    {
      name: "Nguyễn Thị D",
      role: "Operations Manager",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
      description:
        "Đảm bảo mọi quy trình vận hành diễn ra suôn sẻ và hiệu quả.",
    },
  ];

  const achievements = [
    { number: "50K+", label: "Khách hàng hài lòng", icon: Users },
    { number: "100K+", label: "Sản phẩm đã bán", icon: TrendingUp },
    { number: "95%", label: "Đánh giá 5 sao", icon: Star },
    { number: "24/7", label: "Hỗ trợ khách hàng", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-neutral-800 via-neutral-600 to-black/40 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Câu Chuyện Của Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Hành trình từ một ước mơ nhỏ đến thương hiệu thời trang được yêu
              thích
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6" />
              <span className="text-lg font-medium">Kể từ năm 2019</span>
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Hành Trình Của Chúng Tôi
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Bắt đầu từ năm 2019, chúng tôi khởi nghiệp với một cửa hàng
                    nhỏ và niềm đam mê mãnh liệt với thời trang. Ước mơ của
                    chúng tôi là mang đến cho mọi người những trang phục không
                    chỉ đẹp mà còn thể hiện được cá tính riêng.
                  </p>
                  <p>
                    Qua những năm tháng phát triển, chúng tôi đã không ngừng học
                    hỏi, cải tiến và lắng nghe ý kiến từ khách hàng. Mỗi sản
                    phẩm được tạo ra đều mang trong mình tình yêu và sự tận tâm
                    của cả đội ngũ.
                  </p>
                  <p>
                    Ngày hôm nay, chúng tôi tự hào là một trong những thương
                    hiệu thời trang được yêu thích nhất, với hơn 50,000 khách
                    hàng tin tưởng trên toàn quốc.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                    alt="Our Story"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      5+
                    </div>
                    <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cột Mốc Phát Triển
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những khoảnh khắc đáng nhớ trong hành trình xây dựng thương hiệu
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  } mb-12`}
                >
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-blue-600 font-bold text-lg mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow text-center"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-6`}
                >
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Đội Ngũ Của Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những con người tài năng và đam mê đằng sau thành công của thương
              hiệu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-r from-neutral-700 to-black/40 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Thành Tựu Của Chúng Tôi</h2>
            <p className="text-xl opacity-90">
              Những con số biết nói về hành trình phát triển
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2">
                  {achievement.number}
                </div>
                <div className="text-lg opacity-90">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-neutral-600 to-black/40 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tầm Nhìn Tương Lai
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Chúng tôi hướng đến việc trở thành thương hiệu thời trang hàng đầu
              Việt Nam, không chỉ về chất lượng sản phẩm mà còn về trách nhiệm
              xã hội và môi trường. Mục tiêu của chúng tôi là tạo ra một cộng
              đồng thời trang bền vững, nơi mọi người đều có thể thể hiện phong
              cách riêng một cách tự tin.
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Lightbulb className="w-6 h-6" />
              <span className="text-lg font-medium">
                Đổi mới - Bền vững - Phát triển
              </span>
              <Lightbulb className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stories;
