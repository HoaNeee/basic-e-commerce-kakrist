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
import { get, post } from "@/utils/requets";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      await post("/subscribers/create-contact", formData);
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
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="md:text-5xl mb-6 text-4xl font-bold text-gray-900">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl leading-relaxed text-gray-600">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với
              chúng tôi qua bất kỳ kênh nào dưới đây hoặc gửi tin nhắn trực
              tiếp.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 mx-auto">
        <div className="lg:grid-cols-3 grid gap-12">
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-8 bg-white shadow-lg">
              <div className="mb-8">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  Gửi Tin Nhắn
                </h2>
                <p className="text-gray-600">
                  Điền thông tin vào form dưới đây, chúng tôi sẽ phản hồi trong
                  vòng 24 giờ.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="md:grid-cols-2 grid gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Họ và tên *
                    </label>
                    <div className="relative">
                      <User className="left-3 top-1/2 absolute w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="py-5.5 pl-10 pr-4"
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="left-3 top-1/2 absolute w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="py-5.5 pl-10 pr-4"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:grid-cols-2 grid gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="left-3 top-1/2 absolute w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="py-5.5 pl-10 pr-4"
                        placeholder="+84 123 456 789"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Chủ đề *
                    </label>
                    <Select
                      value={formData.subject}
                      onValueChange={(e) => {
                        const form = { ...formData, subject: e };
                        setFormData(form);
                      }}
                    >
                      <SelectTrigger className="w-full py-5.5">
                        <SelectValue placeholder="Chọn chủ đề" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="product">
                            Hỏi về sản phẩm
                          </SelectItem>
                          <SelectItem value="order">Đơn hàng</SelectItem>
                          <SelectItem value="return">Đổi trả</SelectItem>
                          <SelectItem value="complaint">Khiếu nại</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Tin nhắn *
                  </label>
                  <div className="relative">
                    <MessageSquare className="left-3 top-4 absolute w-5 h-5 text-gray-400" />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full py-3 pl-10 pr-4 transition-colors border border-gray-300 rounded-lg resize-none"
                      placeholder="Nhập tin nhắn của bạn..."
                    />
                  </div>
                </div>

                {submitStatus === "success" && (
                  <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
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
                        <p className="font-medium text-green-800">
                          Tin nhắn đã được gửi thành công!
                        </p>
                        <p className="mt-1 text-sm text-green-700">
                          Chúng tôi sẽ phản hồi sớm nhất có thể.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-50 p-4 border border-red-200 rounded-lg">
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
                        <p className="font-medium text-red-800">
                          Có lỗi xảy ra!
                        </p>
                        <p className="mt-1 text-sm text-red-700">
                          Vui lòng thử lại sau.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-7 flex items-center justify-center w-full gap-2 px-6 font-semibold text-white transition-colors rounded-lg"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
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

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Thông Tin Liên Hệ
              </h3>
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl hover:shadow-md p-6 transition-shadow bg-white shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="p-3 mr-4 bg-black rounded-lg">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="hover:text-blue-600 text-gray-600 transition-colors"
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
            <div className="rounded-xl p-6 bg-white shadow-sm">
              <h4 className="mb-4 font-semibold text-gray-900">
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
            <div className="rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="p-6 border-b">
                <h4 className="flex items-center font-semibold text-gray-900">
                  <Building className="w-5 h-5 mr-2" />
                  Vị Trí Cửa Hàng
                </h4>
              </div>
              <div className="relative h-64 bg-gray-100">
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
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Tìm câu trả lời nhanh chóng cho những thắc mắc phổ biến
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="rounded-xl bg-white shadow-sm">
                  <details className="group">
                    <summary className="hover:bg-gray-50 rounded-xl flex items-center justify-between p-6 cursor-pointer">
                      <h3 className="font-semibold text-gray-900">
                        {item.question}
                      </h3>
                      <svg
                        className="group-open:rotate-180 w-5 h-5 text-gray-500 transition-transform"
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
                      <p className="leading-relaxed text-gray-600">
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
