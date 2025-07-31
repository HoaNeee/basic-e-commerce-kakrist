/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { get, post } from "@/utils/requets";
import { Bot, ChevronDown, Send, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ProductModel } from "@/models/productModel";
import { VND } from "@/utils/formatCurrency";
import Link from "next/link";

interface IMessage {
  role: "user" | "model";
  content: string;
  intent?: string;
  products?: ProductModel[];
}

const Chatbot = () => {
  const [showBox, setShowBox] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const listMessages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    if (listMessages.current) {
      listMessages.current.scrollTo({
        top: listMessages.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const getMessages = async () => {
    try {
      const response = await get("/chatbot/history");
      if (response.data && Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      if (content.trim() === "" || isLoading) return;
      setIsLoading(true);
      setContent("");
      setMessages([...messages, { role: "user", content }]);
      const response = await post("/chatbot", { message: content });
      console.log(response);
      const { intent, response: botResponse } = response.data;

      if (intent === "search_product") {
        const products = response.data.products;
        setMessages((prev) => [
          ...prev,
          { role: "model", content: botResponse, intent, products },
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "model", content: botResponse, intent },
      ]);
    } catch (error) {
      console.log("Error in Chatbot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessages = () => {
    return (
      <div className="flex flex-col gap-4 relative">
        <div className="bg-gray-100 dark:bg-neutral-600 p-3 rounded-lg rounded-tl-none max-w-9/10">
          <p className="text-sm text-gray-700 dark:text-gray-200 max-w-full break-all">
            Xin chào! Tôi là trợ lý ảo của trang web này. Bạn cần giúp đỡ gì?
          </p>
        </div>
        {messages.map((message, index) => {
          if (message.role === "user") {
            return renderMessageUser(message.content, index.toString());
          }
          return renderMessageModel(message, index.toString());
        })}
        {isLoading && (
          <div className="box-typing">
            <div className="inner-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMessageModel = (message: IMessage, key: string) => {
    return (
      <div className="flex items-start flex-col gap-3" key={key}>
        <div className="bg-gray-100 dark:bg-neutral-600 p-3 rounded-lg rounded-tl-none max-w-9/10">
          <p
            className="text-sm text-gray-700 dark:text-gray-200 max-w-full break-all"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        </div>
        {message.intent === "search_product" &&
          message.products &&
          message.products.length > 0 && (
            <div className="max-w-9/10 w-full ml-4">
              <h3 className="my-1 text-gray-600 dark:text-gray-200 text-sm">
                Sản phẩm phù hợp cho bạn:
              </h3>
              <div className="flex flex-col gap-2">
                {message.products.map((product) => {
                  return (
                    <div
                      key={product._id}
                      className="py-2 border-b border-gray-200 dark:border-gray-700 flex items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className="md:max-w-full max-w-2/9">
                          <div className="w-15 h-15 rounded-xs bg-muted">
                            <img
                              src={product.thumbnail}
                              alt={""}
                              className="h-full w-full object-cover rounded-xs"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-sm">
                          <Link
                            href={`/shop/${product.slug}`}
                            className="font-semibold text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 text-gray-800"
                          >
                            {product.title}
                          </Link>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {product.options &&
                              product.options.length > 0 &&
                              product.options.map((o) => o.title).join(", ")}
                          </p>
                          <div className="flex items-center gap-2">
                            {product.discountedPrice !== undefined &&
                              product.discountedPrice !== null && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                                  {VND.format(
                                    Number(product.discountedPrice) || 0
                                  )}
                                </p>
                              )}
                            <p
                              className={`text-sm text-gray-600 dark:text-gray-300 ${
                                product.discountedPrice !== undefined &&
                                product.discountedPrice !== null
                                  ? "line-through"
                                  : ""
                              }`}
                            >
                              {VND.format(Number(product.price) || 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    );
  };

  const renderMessageUser = (message: string, key: string) => {
    return (
      <div
        key={key}
        className="bg-pink-100 dark:bg-pink-800 p-3 rounded-lg self-end max-w-9/10 rounded-tr-none"
      >
        <p className="text-sm text-pink-700 dark:text-pink-100 break-all">
          {message}
        </p>
      </div>
    );
  };

  return (
    <>
      <Popover open={showBox} onOpenChange={setShowBox}>
        <PopoverTrigger asChild title="Chatbot">
          <div className="fixed bottom-5 right-2 w-14 h-14 rounded-full overflow-hidden z-50 shadow-lg cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center">
            <div
              className={`w-full h-full shadow-lg flex items-center justify-center relative transition-all duration-300 text-sm ${
                showBox
                  ? "bg-white text-black dark:bg-neutral-800 dark:text-white"
                  : " text-white bg-black dark:bg-white dark:text-black"
              }`}
            >
              <Bot
                className={`w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  showBox ? "opacity-0" : "opacity-100"
                }`}
              />
              <ChevronDown
                className={`w-7 h-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  !showBox ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={10}
          align="end"
          alignOffset={20}
          side="right"
          className="lg:w-md w-xs bg-white dark:bg-black dark:text-white/80 shadow p-0"
        >
          <div className="w-full h-full flex flex-col justify-between relative">
            <div className="py-2 border-b border-gray-200 dark:border-gray-700 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0">
                    <h2 className="font-semibold text-sm">Bot</h2>
                    <span className="text-xs text-gray-400">
                      AI Assistant Demo
                    </span>
                  </div>
                </div>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  onClick={() => setShowBox(false)}
                  className=""
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              className="px-4 pt-2 min-h-60 max-h-90 overflow-hidden overflow-y-auto custom-scrollbar relative"
              ref={listMessages}
            >
              {renderMessages()}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 relative">
                <Input
                  placeholder="Type your message..."
                  className="w-full pr-10 py-5 rounded-full text-black dark:text-white"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter" && content.trim() !== "") {
                      handleSendMessage(content);
                    }
                  }}
                />
                <div
                  title="Send message"
                  className={`text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-300 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 bg-gray-100 p-1.5 dark:hover:bg-neutral-700 dark:bg-neutral-800
                    ${isLoading ? "cursor-not-allowed" : ""}
                    `}
                  onClick={() => handleSendMessage(content)}
                >
                  <Send
                    className={`transform translate-y-[1px] translate-x-[-1px] transition-all duration-300 ${
                      isLoading ? "opacity-0 cursor-not-allowed" : "opacity-100"
                    }`}
                  />
                  <div
                    className={`transition-all duration-300 ${
                      isLoading ? "opacity-100 cursor-not-allowed" : "opacity-0"
                    } absolute flex items-center justify-center animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-200`}
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Chatbot;
