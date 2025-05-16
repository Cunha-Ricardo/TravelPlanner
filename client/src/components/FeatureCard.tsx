import React from "react";
import { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  iconBgColor: string;
  iconColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  linkText,
  linkHref,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <Link href={linkHref}>
        <a className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center">
          {linkText}
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </Link>
    </div>
  );
};

export default FeatureCard;
