"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Region } from "@/lib/types";
import AddRegion from "./AddRegion";
import useAxiosToken from "@/hooks/useAxiosToken";
import { useQuery } from "@tanstack/react-query";

interface Props {
  onChange: (value: number) => void;  // 👈 now returns ID
  selected?: number;
  defaultValue?: number;
}

const RegionPicker = ({ selected, defaultValue, onChange }: Props ) => {
  const [open, setOpen] = useState(false);
  const axios_instance_token = useAxiosToken();

  const regionsQuery = useQuery<Region[]>({
    queryKey: ["locations", "regions"],
    queryFn: async () =>
      await axios_instance_token.get(`/locations/regions`).then((res) => res.data),
  });

  const [value, setValue] = useState<number>(defaultValue ?? selected ?? 0); // 👈 town ID stored
  
  // Notify parent only when ID changes
  useEffect(() => {
    if (value && value > 0) {
      onChange(value);
    }
  }, [value]);

  const successCallback = useCallback((region: Region) => {
      setValue(region.id);  // 👈 store ID from created town
      setOpen(false);
    }, []);
  
    const selectedRegion = regionsQuery.data?.find((t) => t.id === value);

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
            {selectedRegion ? selectedRegion.name : "Select region"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command shouldFilter>
            <CommandInput placeholder="Search regions..." className="text-xs" />
            <AddRegion successCallback={successCallback} />
            <CommandEmpty>
              <div className="p-2">
                <p className="text-xs">Region not found</p>
                <p className="text-xs text-muted-foreground">
                  Tip: Create a new region
                </p>
              </div>
            </CommandEmpty>

            <CommandGroup>
              <CommandList className="max-h-48 overflow-auto">
                {regionsQuery.data?.map((region) => (
                  <CommandItem
                    key={region.id}
                    value={String(region.name)}
                    onSelect={() => {
                      setValue(region.id); // 👈 store ID
                      setOpen(false);
                    }}
                  >
                    <span className="text-xs">{region.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === region.id ? "opacity-100" : "opacity-0"
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
};

export default RegionPicker;
