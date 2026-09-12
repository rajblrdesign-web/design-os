import {
  FolderKanbanIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LightbulbIcon,
  SettingsIcon,
} from "lucide-react";

import { type NavItem } from "@/types/navigation";

export const mainNavItems: NavItem[] = [
  {
    title: "Workspace",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Inspiration",
    href: "/inspiration",
    icon: LightbulbIcon,
    items: [],
  },
  {
    title: "Collections",
    href: "/collections",
    icon: FolderKanbanIcon,
    items: [],
  },
  {
    title: "Favorites",
    href: "/favorites",
    icon: HeartIcon,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    items: [],
  },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  const isExactMatch =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  if (isExactMatch) {
    return true;
  }

  return item.items?.some((child) => isNavItemActive(pathname, child)) ?? false;
}

export function isNavItemExactMatch(pathname: string, item: NavItem): boolean {
  return item.href === "/"
    ? pathname === "/"
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getPageTitle(pathname: string): string {
  for (const item of mainNavItems) {
    if (isNavItemExactMatch(pathname, item)) {
      return item.title;
    }

    const child = item.items?.find((nestedItem) =>
      isNavItemExactMatch(pathname, nestedItem)
    );

    if (child) {
      return child.title;
    }
  }

  return "Design OS";
}
