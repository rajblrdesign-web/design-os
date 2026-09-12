"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isNavItemActive,
  isNavItemExactMatch,
  mainNavItems,
} from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { type NavItem } from "@/types/navigation";

type SidebarNavItemProps = {
  item: NavItem;
  onNavigate?: () => void;
  depth?: number;
};

function SidebarNavItem({
  item,
  onNavigate,
  depth = 0,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;
  const hasChildren = Boolean(item.items?.length);
  const isActive = isNavItemExactMatch(pathname, item);
  const isAncestorActive = hasChildren && isNavItemActive(pathname, item);

  return (
    <div className="flex flex-col gap-0.5">
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors duration-150",
          depth > 0 && "ml-3 border-l border-sidebar-border/60 pl-3",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_oklch(0_0_0/4%)] dark:shadow-[inset_0_0_0_1px_oklch(1_0_0/6%)]"
            : isAncestorActive
              ? "text-sidebar-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon
          className={cn(
            "size-5 shrink-0",
            isActive ? "opacity-100" : "opacity-70"
          )}
        />
        {item.title}
      </Link>

      {hasChildren ? (
        <div className="flex flex-col gap-0.5">
          {item.items?.map((child) => (
            <SidebarNavItem
              key={child.href}
              item={child}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type SidebarContentProps = {
  onNavigate?: () => void;
};

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {mainNavItems.map((item) => (
        <SidebarNavItem key={item.href} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-full w-[256px] shrink-0 flex-col border-r border-sidebar-border/80 bg-sidebar lg:flex">
      <div className="flex h-[60px] items-center gap-3 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
          <span className="text-xs font-semibold">DO</span>
        </div>
        <span className="font-heading text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">
          Design OS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <SidebarContent />
      </div>
    </aside>
  );
}
