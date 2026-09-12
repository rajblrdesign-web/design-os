"use client";

import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CollectionActionsMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function CollectionActionsMenu({
  onEdit,
  onDelete,
}: CollectionActionsMenuProps) {
  const handleDelete = () => {
    if (
      window.confirm(
        "Delete this collection? Inspirations in your library will not be removed."
      )
    ) {
      onDelete();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Collection actions"
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(event) => event.preventDefault()}
          />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={(event) => {
              event.preventDefault();
              onEdit();
            }}
          >
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
