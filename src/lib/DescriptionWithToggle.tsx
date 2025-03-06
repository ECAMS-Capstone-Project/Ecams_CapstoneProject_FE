import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import { MoreHorizontal } from "lucide-react";

interface DescriptionProps {
  text: string;
}

export const DescriptionWithToggle: React.FC<DescriptionProps> = ({ text }) => {
  // Giới hạn số từ muốn hiển thị ban đầu
  const WORD_LIMIT = 20;

  // Tách mô tả thành mảng từ
  const words = text.split(" ");

  // Kiểm tra xem có vượt quá giới hạn hay không
  const isOverLimit = words.length > WORD_LIMIT;

  // Tạo state để kiểm soát hiển thị đầy đủ hay không
  const [isExpanded, setIsExpanded] = useState(false);

  // Nếu chưa expanded, cắt mảng words thành WORD_LIMIT, nếu expanded thì hiển thị tất cả
  const displayedText = isExpanded
    ? text
    : words.slice(0, WORD_LIMIT).join(" ");

  return (
    <div>
      {/* Phần hiển thị mô tả */}
      <Typography
        variant="body2"
        style={{ textAlign: "justify" }}
        className="text-gray-700 text-ba"
      >
        {displayedText}
        {/* Nếu chưa expanded và có nhiều hơn WORD_LIMIT từ => thêm "..." */}
        {!isExpanded && isOverLimit && "..."}
      </Typography>

      {/* Nút "..." hoặc "Show more" */}
      {isOverLimit && (
        <Button
          variant="text"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          // endIcon={<MoreHorizontal size={16} />}
          sx={{ textTransform: "none", padding: 0, minWidth: "20px" }}
        >
          {isExpanded ? "Show less" : <MoreHorizontal size={16} />}
        </Button>
      )}
    </div>
  );
};
