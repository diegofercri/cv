"use client";

import { CommandIcon } from "lucide-react";
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import type { Dictionary } from "@/lib/i18n";
import { Button } from "./ui/button";

interface Props {
  links: { url: string; title: string }[];
  dict: Dictionary;
}

export const CommandMenu = ({ links, dict }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    setIsMac(window.navigator.userAgent.includes("Mac"));

    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const shortcut = `${isMac ? "⌘" : "Ctrl"}+J`;

  return (
    <>
      <p className="fixed bottom-0 left-0 right-0 hidden bg-gradient-to-t from-[hsl(var(--background))] to-transparent p-1 pt-6 text-center text-sm text-muted-foreground xl:block print:hidden">
        {dict.commandMenuHint.replace("{shortcut}", shortcut)}
      </p>
      <Button
        onClick={() => setOpen((open) => !open)}
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 flex rounded-full shadow-2xl xl:hidden print:hidden"
        aria-label={dict.actions}
      >
        <CommandIcon className="my-6 size-6" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={dict.commandMenuTitle}
        description={dict.commandMenuDescription}
      >
        <CommandInput placeholder={dict.commandPlaceholder} />
        <CommandList>
          <CommandEmpty>{dict.noResults}</CommandEmpty>
          <CommandGroup heading={dict.actions}>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.print();
              }}
            >
              <span>{dict.print}</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading={dict.links}>
            {links.map(({ url, title }) => (
              <CommandItem
                key={url}
                onSelect={() => {
                  setOpen(false);
                  window.open(url, "_blank");
                }}
              >
                <span>{title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};
