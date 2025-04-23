import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import { MoreHorizontal } from "lucide-react";
import parse from "html-react-parser";

interface DescriptionProps {
  text: string;
}

export const DescriptionWithToggle: React.FC<DescriptionProps> = ({ text }) => {
  const WORD_LIMIT = 20;
  const words = text.replace(/<[^>]*>/g, "").split(" ");
  const isOverLimit = words.length > WORD_LIMIT;
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedText = isExpanded ? text : words.slice(0, WORD_LIMIT).join(" ");

  return (
    <div>
      <Typography
        variant="body2"
        style={{ textAlign: "justify" }}
        className="text-gray-700 text-ba"
      >
        {isExpanded ? parse(text) : displayedText}
        {!isExpanded && isOverLimit && " ..."}
      </Typography>

      {isOverLimit && (
        <Button
          variant="text"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          sx={{ textTransform: "none", padding: 0, minWidth: "20px" }}
        >
          {isExpanded ? "Show less" : <MoreHorizontal size={16} />}
        </Button>
      )}
    </div>
  );
};
