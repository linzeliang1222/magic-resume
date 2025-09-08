"use client";

import { useState, useEffect } from "react";
import OCModal from "./OCModal";

const OC_MODAL_KEY = "oc-modal-viewed";

const OCModalClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 检查是否是客户端环境
    if (typeof window !== "undefined") {
      const hasViewed = localStorage.getItem(OC_MODAL_KEY);
      
      // 如果用户没有查看过，则显示模态框
      if (!hasViewed) {
        // 延迟1秒显示，提升用户体验
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
      
      setIsLoaded(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // 记录用户已查看
    if (typeof window !== "undefined") {
      localStorage.setItem(OC_MODAL_KEY, "true");
    }
  };

  // 避免服务端渲染时的水合不匹配
  if (!isLoaded && typeof window === "undefined") {
    return null;
  }

  return <OCModal isOpen={isOpen} onClose={handleClose} />;
};

export default OCModalClient;