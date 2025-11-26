"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  values: string[];
  onChange: (value: string[]) => void;
  selected?: string[];
  removeDepartment: (index: number) => void;
}

const DepartmentsPicker = ({ values, selected = [], onChange, removeDepartment }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>(selected);

  // Sync with parent
  useEffect(() => {
    setValue(Array.isArray(selected) ? selected : []);
  }, [selected]);

  // Push updates upward
  useEffect(() => {
    onChange(value);
  }, [value]);

  const toggleValue = (opt: string) => {
    setValue((prev) => {
      if (prev.includes(opt)) return prev.filter((v) => v !== opt);
      return [...prev, opt];
    });
  };

  return (
    <>
      {/* Selected tags */}
      <div className="flex flex-wrap gap-1 pb-2">
        {value.map((item, index) => (
          <div
            key={item}
            className="px-2 flex gap-1 items-center text-xs py-1 bg-gray-200 rounded-full"
          >
            {item}
            <button
              type="button"
              onClick={() => removeDepartment(index)}
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
            {value.length > 0 ? `${value.length} selected` : "Select department"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search department..." />
            <CommandGroup>
              <CommandList className="h-48 overflow-auto">
                {values.length === 0 && (
                  <CommandItem>No departments available</CommandItem>
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

export default DepartmentsPicker;
