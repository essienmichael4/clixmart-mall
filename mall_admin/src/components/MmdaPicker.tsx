"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mmda } from "@/lib/types";
import AddMmda from "./AddMmda";
import useAxiosToken from "@/hooks/useAxiosToken";
import { useQuery } from "@tanstack/react-query";

interface Props {
  onChange: (value: number) => void;  // 👈 now returns ID
  selected?: number;
  defaultValue?: number;
  regionId?: number;
}

const MmdaPicker = ({ selected, defaultValue, onChange, regionId }: Props ) => {
  const [open, setOpen] = useState(false);
  const axios_instance_token = useAxiosToken();
  
  const mmdaQuery = useQuery<Mmda[]>({
    queryKey: ["locations", "mmdas"],
    queryFn: async () => regionId ? 
      await axios_instance_token.get(`/locations/regions/${regionId}/mmdas`).then((res) => res.data) :
      await axios_instance_token.get(`/locations/mmdas`).then((res) => res.data)
  });

  const [value, setValue] = useState<number>(defaultValue ?? selected ?? 0); // 👈 town ID stored
  
    // Notify parent only when ID changes
  useEffect(() => {
    if (value && value > 0) {
      onChange(value);
    }
  }, [value]);

  const successCallback = useCallback((mmda: Mmda) => {
    setValue(mmda.id);  // 👈 store ID from created town
    setOpen(false);
  }, []);

  const selectedMmda = mmdaQuery.data?.find((t) => t.id === value);

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
            {selectedMmda ? selectedMmda.name : "Select mmda"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command shouldFilter>
            <CommandInput placeholder="Search mmda..." className="text-xs" />
            <AddMmda successCallback={successCallback} />
            <CommandEmpty>
              <div className="p-2">
                <p className="text-xs">Mmda not found</p>
                <p className="text-xs text-muted-foreground">
                  Tip: Create a new mmda
                </p>
              </div>
            </CommandEmpty>

            <CommandGroup>
              <CommandList className="max-h-48 overflow-auto">
                {mmdaQuery.data?.map((mmda) => (
                  <CommandItem
                    key={mmda.id}
                    value={String(mmda.name)}
                    onSelect={() => {
                      setValue(mmda.id); // 👈 store ID
                      setOpen(false);
                    }}
                  >
                    <span className="text-xs">{mmda.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === mmda.id ? "opacity-100" : "opacity-0"
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

export default MmdaPicker;
