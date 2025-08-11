import React from "react";
import Image from "next/image";
import STORY1 from "../../assets/auth-register.png";
import STORY2 from "../../assets/story1.webp";
import STORY3 from "../../assets/story2.jpg";
import STORY4 from "../../assets/story3.jpg";
import { FaInstagram } from "react-icons/fa6";
import { ButtonTransition } from "../ui/button";
import { get } from "@/utils/requets";
import Link from "next/link";

const getSettings = async () => {
  try {
    const response = await get("/settings");
    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

const OurInstagramStory = async () => {
  const settings = await getSettings();

  return (
    <div className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with our latest products and behind-the-scenes moments
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="aspect-square relative group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={STORY4}
              alt="Instagram story"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <FaInstagram className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="aspect-square relative group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={STORY2}
              alt="Instagram story"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <FaInstagram className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="aspect-square relative group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={STORY3}
              alt="Instagram story"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <FaInstagram className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="aspect-square relative group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={STORY1}
              alt="Instagram story"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <FaInstagram className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href={settings?.instagramLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ButtonTransition className="px-4 py-3">
              <FaInstagram className="mr-2" />
              Follow @Kakrist
            </ButtonTransition>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurInstagramStory;
