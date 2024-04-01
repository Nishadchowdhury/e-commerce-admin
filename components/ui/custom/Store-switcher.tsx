"use client"
import { useStoreModal } from "@/hooks/zustand/use-store-modal";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger> // this added by tache but I avoided.

interface StoreSwitcherProps {
    items: Store[];
    className?: string
}

function StoreSwitcher({
    className,
    items = []
}: StoreSwitcherProps) {

    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    // we re formate it to use in the select items.
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId)

    const [open, setOpen] = useState(false)

    const onStoreSelect = (store: { value: string, label: string }) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }


    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="mr-2 w-4 h-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto w-4 h-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">

                <Command>
                    <CommandList >
                        <CommandInput placeholder="Search store..." />
                        <CommandEmpty ><span className="text-red-500" >No store found.</span></CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store) => {
                                return (
                                    <CommandItem
                                        key={store.value}
                                        onSelect={() => onStoreSelect(store)}
                                        className="text-sm"
                                    >
                                        <StoreIcon className="mr-2 h-4 w-4" />
                                        {store.label}
                                        <Check
                                            className={cn("ml-auto h-4 w-4",
                                                currentStore?.value === store.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator />

                    <CommandList >
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle
                                    className="mr-2 h-5 w-5"
                                />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>

            </PopoverContent>
        </Popover >
    )
}
export default StoreSwitcher
