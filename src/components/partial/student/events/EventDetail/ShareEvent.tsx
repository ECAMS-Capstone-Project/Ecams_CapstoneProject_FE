import React from "react";
import { Copy, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { toast } from "react-hot-toast"; // Replace sonner with react-toastify
import { motion } from "framer-motion";

const InviteFriendPage: React.FC = () => {
  const shareUrl = window.location.href as string; // Vite uses import.meta.env

  const socialLink = [
    {
      logo: (
        <TwitterShareButton url={shareUrl}>
          <TwitterIcon className="h-12 w-12 p-0" borderRadius={14} />
        </TwitterShareButton>
      ),
      name: "X",
    },
    {
      logo: (
        <WhatsappShareButton url={shareUrl}>
          <WhatsappIcon className="h-12 w-12 p-0 " borderRadius={14} />
        </WhatsappShareButton>
      ),
      name: "WhatsApp",
    },
    {
      logo: (
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon className="h-12 w-12 p-0 " borderRadius={14} />
        </FacebookShareButton>
      ),
      name: "Facebook",
    },

    {
      logo: (
        <LinkedinShareButton url={shareUrl}>
          <LinkedinIcon className="h-12 w-12 p-0 " borderRadius={14} />
        </LinkedinShareButton>
      ),
      name: "Linkedln",
    },
    {
      logo: (
        <TelegramShareButton url={shareUrl}>
          <TelegramIcon className="h-12 w-12 p-0 " borderRadius={14} />
        </TelegramShareButton>
      ),
      name: "Telegram",
    },
    {
      logo: (
        <EmailShareButton url={shareUrl}>
          <EmailIcon className="h-12 w-12 p-0 " borderRadius={14} />
        </EmailShareButton>
      ),
      name: "Email",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("URL copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <div className="flex pb-10 flex-col gap-y-4">
        <div className="h-12 w-[400px] cursor-pointer rounded-xl overflow-hidden flex flex-row items-center bg-[#a8b3cf14] px-4">
          <Link className="h-5 w-5 mr-2 text-primary" />
          <div className="flex flex-col flex-1">
            <div
              onClick={handleCopy}
              className="border-none hover:opacity-80 px-3 outline-none text-primary shadow-none focus-visible:ring-0 truncate max-w-[300px]"
            >
              {shareUrl}
            </div>
          </div>
          {/* <Hint label="Copy to clipboard" side="bottom" sideOffset={10}> */}
          <Button onClick={handleCopy} size={"icon"} variant={"ghost"}>
            <Copy className="h-5 w-5" />
          </Button>
          {/* </Hint> */}
        </div>
        <p className="font-semibold">Or invite via</p>
        <div className="flex flex-row flex-wrap gap-2 gap-y-4">
          {socialLink.map((data, index) => (
            <div key={index} className="flex flex-col w-16 items-center">
              <div className="overflow-hidden rounded-14">{data.logo}</div>
              <span className="mt-1.5 max-w-16 overflow-hidden overflow-ellipsis text-center text-[11px] text-text-tertiary cursor-pointer">
                {data.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InviteFriendPage;
