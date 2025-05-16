import React from "react";
import { Clock } from "lucide-react";
import { Info } from "lucide-react";

export interface Activity {
  id: string;
  time: string;
  description: string;
}

interface ItineraryDayProps {
  date: string;
  title: string;
  activities: Activity[];
  tip?: string;
}

const ItineraryDay: React.FC<ItineraryDayProps> = ({
  date,
  title,
  activities,
  tip,
}) => {
  return (
    <div className="border-l-4 border-primary-500 pl-4">
      <div className="flex items-center mb-2">
        <div className="bg-primary-100 text-primary-800 font-medium px-3 py-1 rounded-full text-sm">
          {date}
        </div>
      </div>
      <h4 className="font-semibold text-lg mb-3">{title}</h4>
      <ul className="space-y-3">
        {activities.map((activity) => (
          <li key={activity.id} className="flex">
            <div className="flex-shrink-0 flex h-5 items-center">
              <Clock className="h-4 w-4 text-primary-600" />
            </div>
            <div className="ml-3 text-sm">
              <span className="font-medium">{activity.time}</span>
              <p>{activity.description}</p>
            </div>
          </li>
        ))}
      </ul>
      {tip && (
        <div className="mt-3">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-gray-400" />
            <span className="ml-1 text-sm text-gray-500">Dica: {tip}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryDay;
