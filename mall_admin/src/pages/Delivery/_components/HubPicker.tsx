import useAxiosToken from "@/hooks/useAxiosToken";
import { Hub } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandList, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddHub from "@/pages/Hub/_components/AddHub";

interface Props {
  onChange: (value: number) => void;  // 👈 now returns ID
  selected?: number;
  defaultValue?: number;
}

const HubPicker = ({ selected, defaultValue, onChange, }: Props) => {
    const [open, setOpen] = useState(false);
    const axios_instance_token = useAxiosToken();
    
    const hubsQuery = useQuery<Hub[]>({
        queryKey: ["hubs"],
        queryFn: async () => await axios_instance_token.get(`/hubs`).then((res) => res.data)
    });

    const [value, setValue] = useState<number>(defaultValue ?? selected ?? 0); // 👈 town ID stored
    
    useEffect(() => {
        if (value && value > 0) {
            onChange(value);
        }
    }, [value]);

    const successCallback = useCallback((hub: Hub) => {
        setValue(Number(hub.id));  // 👈 store ID from created town
        setOpen(false);
    }, []);

    const selectedHub = hubsQuery.data?.find((t) => t.id === value);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-xs"
                    type="button"
                >
                    {selectedHub ? selectedHub.name : "Select hub"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                <Command shouldFilter>
                    <CommandInput placeholder="Search hubs..." className="text-xs" />
                    <AddHub variant="ghost" successCallback={successCallback} />
                    <CommandEmpty>
                    <div className="p-2">
                        <p className="text-xs">Hub not found</p>
                        <p className="text-xs text-muted-foreground">
                            Tip: Create a new hub
                        </p>
                    </div>
                    </CommandEmpty>

                    <CommandGroup>
                    <CommandList className="max-h-48 overflow-auto">
                        {hubsQuery.data?.map((hub) => (
                        <CommandItem
                            key={hub!.id}
                            value={String(hub.name)}
                            onSelect={() => {
                            setValue(Number(hub!.id)); // 👈 store ID
                            setOpen(false);
                            }}
                        >
                            <span className="text-xs">{hub.name}</span>
                            <Check
                            className={cn(
                                "ml-auto h-4 w-4",
                                value === hub.id ? "opacity-100" : "opacity-0"
                            )}
                            />
                        </CommandItem>
                        ))}
                    </CommandList>
                    </CommandGroup>
                </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}

export default HubPicker
