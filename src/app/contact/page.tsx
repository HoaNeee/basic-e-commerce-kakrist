"use client";

import React, { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Building,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemSettingModel } from "@/models/settingSystem";
import { get } from "@/utils/requets";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [systemSettings, setSystemSettings] =
    useState<SystemSettingModel | null>(null);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const response = await get("/settings");
        if (response && response.data) {
          setSystemSettings(response.data);
        } else {
          console.error("No system settings found");
        }
      } catch (error) {
        console.error("Error fetching system settings:", error);
      }
    };

    fetchSystemSettings();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: systemSettings?.address || "123 Đường ABC, Quận 1, TP.HCM",
      link: "https://maps.google.com",
    },
    {
      icon: Phone,
      title: "Số điện thoại",
      content: systemSettings?.phone || "+84 393911183",
      link: "tel:+84393911183",
    },
    {
      icon: Mail,
      title: "Email",
      content: systemSettings?.email || "contact@kakrist.com",
      link: `mailto:contact@${systemSettings?.email || "kakrist.com"}`,
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "T2-CN: 8:00 - 22:00",
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      name: "Facebook",
      url: "https://facebook.com",
      color: "text-blue-600",
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://instagram.com",
      color: "text-pink-600",
    },
    {
      icon: Twitter,
      name: "Twitter",
      url: "https://twitter.com",
      color: "text-blue-400",
    },
    {
      icon: Youtube,
      name: "Youtube",
      url: "https://youtube.com",
      color: "text-red-600",
    },
  ];

  const faqItems = [
    {
      question: "Làm thế nào để tôi có thể đổi trả sản phẩm?",
      answer:
        "Bạn có thể đổi trả sản phẩm trong vòng 30 ngày kể từ ngày mua hàng với điều kiện sản phẩm còn nguyên tem mác và chưa sử dụng.",
    },
    {
      question: "Thời gian giao hàng là bao lâu?",
      answer:
        "Thời gian giao hàng tiêu chuẩn là 2-3 ngày làm việc đối với nội thành và 3-5 ngày đối với các tỉnh thành khác.",
    },
    {
      question: "Tôi có thể thanh toán bằng những phương thức nào?",
      answer:
        "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử và thanh toán khi nhận hàng (COD).",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với
              chúng tôi qua bất kỳ kênh nào dưới đây hoặc gửi tin nhắn trực
              tiếp.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Gửi Tin Nhắn
                </h2>
                <p className="text-gray-600">
                  Điền thông tin vào form dưới đây, chúng tôi sẽ phản hồi trong
                  vòng 24 giờ.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Họ và tên *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="+84 123 456 789"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Chủ đề *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="product">Hỏi về sản phẩm</option>
                      <option value="order">Đơn hàng</option>
                      <option value="return">Đổi trả</option>
                      <option value="complaint">Khiếu nại</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tin nhắn *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Nhập tin nhắn của bạn..."
                    />
                  </div>
                </div>

                {/* Submit Status */}
                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="text-green-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-green-800 font-medium">
                          Tin nhắn đã được gửi thành công!
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          Chúng tôi sẽ phản hồi sớm nhất có thể.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="text-red-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-red-800 font-medium">
                          Có lỗi xảy ra!
                        </p>
                        <p className="text-red-700 text-sm mt-1">
                          Vui lòng thử lại sau.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-semibold py-7 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Gửi tin nhắn
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Thông Tin Liên Hệ
              </h3>
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="bg-black rounded-lg p-3 mr-4">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{item.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">
                Theo Dõi Chúng Tôi
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${social.color} hover:scale-110 transform transition-transform`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 border-b">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Vị Trí Cửa Hàng
                </h4>
              </div>
              <div className="h-64 bg-gray-100 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4609464140937!2d106.69830451411816!3d10.776530192318793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0x92a00fd8994b8bd!2zTmd1eeG7hW4gSHXhu4csIEJlbiBOZ2hlLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1642597234567!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tìm câu trả lời nhanh chóng cho những thắc mắc phổ biến
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900">
                        {item.question}
                      </h3>
                      <svg
                        className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
