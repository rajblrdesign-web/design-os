import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number | string;
  href?: string;
  className?: string;
};

export function StatCard({ label, value, href, className }: StatCardProps) {
  const content = (
    <Card
      className={cn(
        "ring-border/60 transition-all duration-200",
        href && "hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <CardContent className="flex flex-col gap-2 pt-6">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <p className="font-heading text-3xl font-semibold tracking-tight">
          {value}
        </p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
