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
      <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 relative py-20 overflow-hidden text-white">
        <div className="bg-black/20 absolute inset-0"></div>
        <div className="container relative px-4 mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="md:text-6xl mb-6 text-5xl font-bold">
              Câu Chuyện Của Chúng Tôi
            </h1>
            <p className="md:text-2xl opacity-90 mb-8 text-xl">
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

      <section className="bg-gray-50 py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="lg:grid-cols-2 grid items-center gap-12">
              <div>
                <h2 className="mb-6 text-4xl font-bold text-gray-900">
                  Hành Trình Của Chúng Tôi
                </h2>
                <div className="space-y-6 leading-relaxed text-gray-700">
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
                <div className="h-96 rounded-2xl relative overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                    alt="Our Story"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="-bottom-6 -right-6 rounded-xl absolute p-6 bg-white shadow-lg">
                  <div className="text-center">
                    <div className="mb-1 text-3xl font-bold text-blue-600">
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

      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Cột Mốc Phát Triển
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Những khoảnh khắc đáng nhớ trong hành trình xây dựng thương hiệu
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200 md:block hidden"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  } mb-12`}
                >
                  <div
                    className={`md:w-5/12 w-full ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <div className="rounded-xl hover:shadow-xl p-6 transition-shadow bg-white shadow-lg">
                      <div className="mb-2 text-lg font-bold text-blue-600">
                        {milestone.year}
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="left-1/2 md:block absolute hidden w-4 h-4 transform -translate-x-1/2 bg-blue-600 border-4 border-white rounded-full shadow-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Giá Trị Cốt Lõi
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="md:grid-cols-2 lg:grid-cols-4 grid gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-xl hover:shadow-lg p-8 text-center transition-shadow bg-white shadow-sm"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-6`}
                >
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Đội Ngũ Của Chúng Tôi
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Những con người tài năng và đam mê đằng sau thành công của thương
              hiệu
            </p>
          </div>

          <div className="md:grid-cols-2 lg:grid-cols-4 grid gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="rounded-xl hover:shadow-lg overflow-hidden transition-shadow bg-white shadow-sm"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="mb-3 font-medium text-blue-600">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 py-20 text-white">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Thành Tựu Của Chúng Tôi</h2>
            <p className="opacity-90 text-xl">
              Những con số biết nói về hành trình phát triển
            </p>
          </div>

          <div className="md:grid-cols-2 lg:grid-cols-4 grid gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 rounded-2xl flex items-center justify-center w-16 h-16 mx-auto mb-4">
                  <achievement.icon className="w-8 h-8" />
                </div>
                <div className="mb-2 text-4xl font-bold">
                  {achievement.number}
                </div>
                <div className="opacity-90 text-lg">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/80 to-primary/60 rounded-2xl flex items-center justify-center w-16 h-16 mx-auto mb-8">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              Tầm Nhìn Tương Lai
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-gray-700">
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
