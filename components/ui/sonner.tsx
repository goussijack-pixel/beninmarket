"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-400" />,
        info: <InfoIcon className="size-4 text-amber-400" />,
        warning: <TriangleAlertIcon className="size-4 text-orange-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 text-amber-400 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "!bg-[#1a1a1a] !border !border-white/10 !text-white !rounded-2xl !shadow-2xl !shadow-black/50",
          title: "!text-white !font-bold !text-sm",
          description: "!text-white/40 !text-xs",
          success: "!border-green-500/20",
          error: "!border-red-500/20",
          warning: "!border-orange-500/20",
          info: "!border-amber-500/20",
          actionButton: "!bg-amber-400 !text-black !font-bold !rounded-lg hover:!bg-amber-500",
          cancelButton: "!bg-white/5 !text-white/50 !rounded-lg hover:!bg-white/10",
        },
      }}
      style={{
        "--normal-bg": "#1a1a1a",
        "--normal-text": "#ffffff",
        "--normal-border": "rgba(255,255,255,0.08)",
        "--border-radius": "1rem",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }