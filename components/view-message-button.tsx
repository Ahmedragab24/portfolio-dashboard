"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import type { Message } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface ViewMessageButtonProps {
  message: Message;
}

export function ViewMessageButton({ message }: ViewMessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message from {message.name}</DialogTitle>
          <DialogDescription>
            {message.$createdAt
              ? formatDate(message.$createdAt)
              : "Unknown date"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">From:</span>
            <div className="col-span-3">
              <p>{message.name}</p>
              <p className="text-sm text-muted-foreground">{message.email}</p>
              <p className="text-sm text-muted-foreground">
                {message.PhoneNumber}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-sm font-medium">Message:</span>
            <div className="col-span-3">
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
