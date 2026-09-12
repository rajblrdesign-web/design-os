import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuickActionProps = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function QuickAction({ label, description, href, icon: Icon }: QuickActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-auto flex-col items-start gap-2 px-4 py-4 text-left whitespace-normal"
      )}
    >
      <Icon className="size-4 text-muted-foreground" />
      <span className="font-medium">{label}</span>
      <span className="text-xs leading-relaxed font-normal text-muted-foreground">
        {description}
      </span>
    </Link>
  );
}

type SectionHeaderProps = {
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeader({ title, href, linkLabel = "View all" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
