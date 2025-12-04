"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Town } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import useAxiosToken from "@/hooks/useAxiosToken";
import AddTown from "./AddTown";

interface Props {
  onChange: (value: number) => void;  // 👈 now returns ID
  selected?: number;
  defaultValue?: number;
  mmdaId?: number;
}

const TownPicker = ({ selected, defaultValue, onChange, mmdaId }: Props) => {
  const axios_instance_token = useAxiosToken();
  const townsQuery = useQuery<Town[]>({
    queryKey: ["locations", "towns"],
    queryFn: async () => mmdaId ?
      await axios_instance_token.get(`/locations/mmdas/${mmdaId}/towns`).then((res) => res.data) :
      await axios_instance_token.get(`/locations/towns`).then((res) => res.data),
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(defaultValue ?? selected ?? 0); // 👈 town ID stored

  // Notify parent only when ID changes
  useEffect(() => {
    if (value && value > 0) {
      onChange(value);
    }
  }, [value]);

  const successCallback = useCallback((town: Town) => {
    setValue(town.id);  // 👈 store ID from created town
    setOpen(false);
  }, []);

  const selectedTown = townsQuery.data?.find((t) => t.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[230px] justify-between text-xs"
          type="button"
        >
          {selectedTown ? selectedTown.name : "Select town"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command shouldFilter>
          <CommandInput placeholder="Search town..." className="text-xs" />
          <AddTown successCallback={successCallback} />
          <CommandEmpty>
            <div className="p-2">
              <p className="text-xs">Town not found</p>
              <p className="text-xs text-muted-foreground">
                Tip: Create a new town
              </p>
            </div>
          </CommandEmpty>

          <CommandGroup>
            <CommandList className="max-h-48 overflow-auto">
              {townsQuery.data?.map((town) => (
                <CommandItem
                  key={town.id}
                  value={String(town.name)}
                  onSelect={() => {
                    setValue(town.id); // 👈 store ID
                    setOpen(false);
                  }}
                >
                  <span className="text-xs">{town.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === town.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TownPicker;
