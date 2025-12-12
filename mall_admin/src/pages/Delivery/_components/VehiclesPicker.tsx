"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/lib/types";
import useAxiosToken from "@/hooks/useAxiosToken";

interface Props {
  selected?: number[];
  onChange: (value: number[]) => void;
}

const VehiclesPicker = ({ selected = [], onChange }: Props) => {
    const axios = useAxiosToken();

    const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
        queryKey: ["vehicles"],
        queryFn: async () =>
        axios.get("/vehicles").then((res) => res.data),
    });

    const toggleValue = (id: number) => {
        if (selected.includes(id)) {
        onChange(selected.filter((v) => v !== id));
        } else {
        onChange([...selected, id]);
        }
    };

    const removeValue = (id: number) => {
        onChange(selected.filter((v) => v !== id));
    };

    const getVehicleLabel = (id: number) =>
        vehicles.find((v) => v.id === id)?.registrationNumber || id;

    return (
        <>
            {/* Selected vehicles */}
            <div className="flex flex-wrap gap-1 pb-2">
                {selected.map((id) => (
                <div
                    key={id}
                    className="px-2 flex gap-1 items-center text-xs py-1 bg-gray-200 rounded-full"
                >
                    {getVehicleLabel(id)}
                    <button
                    type="button"
                    onClick={() => removeValue(id)}
                    className="bg-gray-700 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center"
                    >
                    ×
                    </button>
                </div>
                ))}
            </div>

            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full text-xs justify-between mt-2"
                >
                    {selected.length > 0
                    ? `${selected.length} selected`
                    : "Select vehicle"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[220px] p-0">
                <Command>
                    <CommandInput
                    className="text-xs"
                    placeholder="Search vehicle..."
                    />
                    <CommandGroup>
                    <CommandList className="h-40 overflow-auto">
                        {isLoading && (
                        <CommandItem className="text-xs">
                            Loading vehicles...
                        </CommandItem>
                        )}

                        {!isLoading && vehicles.length === 0 && (
                        <CommandItem className="text-xs">
                            No vehicles available
                        </CommandItem>
                        )}

                        {vehicles.map((vehicle) => (
                        <CommandItem
                            key={vehicle.id}
                            value={vehicle.registrationNumber}
                            onSelect={() => toggleValue(vehicle.id)}
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                selected.includes(vehicle.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                            />
                            <span className="text-xs">
                            {vehicle.registrationNumber}
                            </span>
                        </CommandItem>
                        ))}
                    </CommandList>
                    </CommandGroup>
                </Command>
                </PopoverContent>
            </Popover>
        </>
    );
};

export default VehiclesPicker;
