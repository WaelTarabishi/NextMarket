"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/Hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client";

type PopoverTrigger = React.ComponentPropsWithRef<typeof PopoverTrigger>;
interface StoreSwitcherProps extends PopoverTrigger {
  items: Store[];
  className?: string;
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = React.useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    console.log("Selected store:", store);
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}>
          <div>
            <StoreIcon className="mr-2 w-4 h-4 " />
          </div>
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <div key={store.value} onClick={() => onStoreSelect(store)}>
                  <CommandItem
                    className={`text-sm  ${
                      currentStore?.value === store.value
                        ? "text-black "
                        : "text-slate-500"
                    } `}>
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {store.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 text-green-500",
                        currentStore?.value === store.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </div>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <Button
                className=" border-none w-full justify-start"
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log("hello");
                  setOpen(false);
                  storeModal.onOpen();
                }}>
                <PlusCircle className="mr-2 h-5 w-5 " />
                Create Store
              </Button>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
