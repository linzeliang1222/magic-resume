"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, X, Sparkles } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OCModal = ({ isOpen, onClose }: OCModalProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={() => {}} modal>
      <DialogPortal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl overflow-hidden"
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* 自定义关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 h-8 w-8 rounded-sm flex items-center justify-center opacity-70 transition-opacity hover:opacity-100 focus:outline-none text-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">关闭</span>
          </button>

          <div className="relative p-6">
            {/* 装饰性背景 */}
            <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />
            
            <div className="relative space-y-6">
              {/* 徽章和标题 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">精选推荐</span>
                </div>
                
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-bold text-center">
                    26届秋招岗位汇总网站
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground leading-relaxed text-center">
                    网站专为26届毕业生打造，覆盖春秋招招全周期，可根据招聘时间、投递地址、岗位要求、工作地点、截止时间进行筛选。
                    <br />
                    <span className="text-sm font-medium text-primary mt-2 block">
                      功能强大，不容错过！
                    </span>
                  </DialogDescription>
                </DialogHeader>
              </motion.div>

              {/* 功能亮点 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-3"
              >
                {[
                  { icon: "🚀", text: "最全26届校招岗位汇总信息" },
                  { icon: "🏢", text: "央国企、互联网大厂、银行、知名企业等热门行业校招岗位信息" },
                  { icon: "✨", text: "日更100+，每日实时更新" },
                  { icon: "🔗", text: "内推广场海量内推码，直达面试" },
                  { icon: "📑", text: "各类测评笔试面试资料包" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* 按钮 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full gap-2 relative overflow-hidden"
                  size="lg"
                  onClick={() => {
                    window.open("https://www.givemeoc.com/?aff=1740", "_blank");
                    onClose();
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    开始投递
                    <ExternalLink className="h-4 w-4" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-primary/20"
                    initial={false}
                    animate={isHovered ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </motion.div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
};

export default OCModal;
