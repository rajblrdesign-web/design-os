"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateAction = {
  label: string;
  onClick?: () => void;
  href?: string;
};

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
};

function EmptyStateButton({
  action,
  variant = "default",
  className,
}: {
  action: EmptyStateAction;
  variant?: "default" | "ghost";
  className?: string;
}) {
  if (action.href) {
    return (
      <Link
        href={action.href}
        className={cn(buttonVariants({ size: "lg", variant }), className)}
      >
        {action.label}
      </Link>
    );
  }

  return (
    <Button
      size="lg"
      variant={variant}
      className={className}
      onClick={action.onClick}
      type="button"
    >
      {action.label}
    </Button>
  );
}

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  const hasActions = primaryAction || secondaryAction;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center sm:px-12 sm:py-20">
      <div className="flex max-w-md flex-col items-center gap-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {hasActions ? (
        <div className="mt-8 flex flex-col items-center gap-4">
          {primaryAction ? (
            <EmptyStateButton
              action={primaryAction}
              className="min-w-40"
            />
          ) : null}

          {primaryAction && secondaryAction ? (
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              or
            </span>
          ) : null}

          {secondaryAction ? (
            <EmptyStateButton
              action={secondaryAction}
              variant="ghost"
              className="text-muted-foreground"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
