import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistItemProps {
  id: string;
  text: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, text, checked, onChange }) => {
  return (
    <li className="flex items-start">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onChange(id, checked as boolean)}
        className="mt-1 rounded text-primary-600 focus:ring-primary-500"
      />
      <label
        htmlFor={id}
        className={`ml-2 text-gray-900 ${checked ? "line-through" : ""}`}
      >
        {text}
      </label>
    </li>
  );
};

export default ChecklistItem;
