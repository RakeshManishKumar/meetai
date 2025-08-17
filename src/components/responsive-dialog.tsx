"use client";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface ResponsiveDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveDialog = ({
  children,
  title,
  description,
  open,
  onOpenChange,
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
