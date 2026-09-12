"use client";

import { BellIcon, MenuIcon } from "lucide-react";
import * as React from "react";

import { SidebarContent } from "@/components/layout/Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function TopNavigation() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-[60px] shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Open navigation"
                className="text-muted-foreground hover:text-foreground"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left" className="w-[256px] border-r border-border/60 p-0">
            <SheetHeader className="border-b border-border/60 px-5 py-5">
              <SheetTitle className="font-heading text-[15px] font-semibold">
                Design OS
              </SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="text-muted-foreground hover:text-foreground"
        >
          <BellIcon className="size-[18px]" />
        </Button>

        <Avatar size="sm" className="ml-1 ring-1 ring-border/60">
          <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
