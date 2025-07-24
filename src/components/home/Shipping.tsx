import React from "react";
import { BsBox } from "react-icons/bs";
import { AiOutlineDollar } from "react-icons/ai";
import { RiHeadphoneLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";

const Shipping = () => {
  const features = [
    {
      icon: <BsBox size={28} />,
      title: "Free Shipping",
      description: "Free shipping on orders over $50",
    },
    {
      icon: <AiOutlineDollar size={28} />,
      title: "Money Back Guarantee",
      description: "30 days money back guarantee",
    },
    {
      icon: <RiHeadphoneLine size={28} />,
      title: "24/7 Support",
      description: "Friendly 24/7 customer support",
    },
    {
      icon: <MdOutlinePayment size={28} />,
      title: "Secure Payment",
      description: "Multiple secure payment options",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-8">
      <div className="mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:bg-gray-50 dark:hover:bg-gray-800 p-6 rounded-lg transition-colors duration-200"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-200">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shipping;
