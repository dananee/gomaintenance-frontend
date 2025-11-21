"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogOverlay = DialogPrimitive.Overlay;

export function DialogContent({ className, ...props }: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gm-border bg-gm-card p-6 shadow-xl focus:outline-none",
          className
        )}
        {...props}
      >
        {props.children}
        <DialogPrimitive.Close className="absolute right-3 top-3 rounded-full p-1 text-gm-muted hover:bg-gm-border/30">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: DialogPrimitive.DialogTitleProps) {
  return <DialogPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2", className)} {...props} />;
}
