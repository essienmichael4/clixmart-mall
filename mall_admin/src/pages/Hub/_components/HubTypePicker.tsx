"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HubType } from "@/lib/types";
import CreateHubType from "./CreateHubType";

interface Props {
  values: string[];
  onChange: (value: string[]) => void;
  selected?: string[];
}

const HubTypesPicker = ({ values, selected = [], onChange, }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>(selected);

  const removeValue = (opt: string) => {
    setValue(prev => prev.filter(v => v !== opt));
  };

  // Sync with parent
  useEffect(() => {
    setValue(Array.isArray(selected) ? selected : []);
  }, [selected]);

  // Push updates upward
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const toggleValue = (opt: string) => {
    setValue((prev) => {
      if (prev.includes(opt)) return prev.filter((v) => v !== opt);
      return [...prev, opt];
    });
  };

  const successCallback = useCallback((hubType: HubType) => {
    setValue((prev) => [...prev, hubType.name]); // ✅ append instead of replace
    setOpen(false); // ✅ close popover cleanly
  }, []);

  return (
    <>
      {/* Selected tags */}
      <div className="flex flex-wrap gap-1 pb-2">
        {value.map((item) => (
          <div
            key={item}
            className="px-2 flex gap-1 items-center text-xs py-1 bg-gray-200 rounded-full"
          >
            {item}
            <button
              type="button"
              onClick={() => removeValue(item)}
              className="bg-gray-700 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full text-xs justify-between mt-2"
          >
            {value.length > 0 ? `${value.length} selected` : "Select hub type"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput className="text-xs" placeholder="Search hub type..." />
            <CreateHubType successCallback={successCallback}/>
            <CommandGroup>
              <CommandList className="h-32 overflow-auto">
                {values.length === 0 && (
                  <CommandItem className="text-xs">No Hub types available</CommandItem>
                )}

                {values.map((opt) => (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={() => toggleValue(opt)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(opt) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="text-xs">{opt}</span>
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

export default HubTypesPicker;
