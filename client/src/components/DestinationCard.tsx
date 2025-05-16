import React from "react";
import { Bell } from "lucide-react";

interface DestinationCardProps {
  image: string;
  name: string;
  country: string;
  tag: string;
  tagType: "popular" | "trend" | "romantic";
  activities: string;
  onClick: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  name,
  country,
  tag,
  tagType,
  activities,
  onClick,
}) => {
  const getTagClass = () => {
    switch (tagType) {
      case "popular":
        return "bg-secondary-100 text-secondary-800";
      case "trend":
        return "bg-secondary-100 text-secondary-800";
      case "romantic":
        return "bg-primary-100 text-primary-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={image}
        alt={`${name}, ${country}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-gray-600 text-sm">{country}</p>
          </div>
          <span className={`${getTagClass()} text-xs font-medium px-2 py-1 rounded-full`}>{tag}</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            <Bell className="h-4 w-4 text-accent-500 mr-1" />
            <span>Ideal para: {activities}</span>
          </div>
          <button
            className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={onClick}
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
