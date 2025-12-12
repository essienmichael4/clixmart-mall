"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import useAxiosToken from "@/hooks/useAxiosToken";
import { useQuery } from "@tanstack/react-query";
import AddAccountDialog from "./AddAccountDialog";

interface Props {
  onChange: (value: number) => void;  // 👈 now returns ID
  selected?: number;
  defaultValue?: number;
}

const AccountPicker = ({ selected, defaultValue, onChange, }: Props ) => {
  const [open, setOpen] = useState(false);
  const axios_instance_token = useAxiosToken();
  
  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => await axios_instance_token.get(`/users`).then((res) => res.data)
  });

  const [value, setValue] = useState<number>(defaultValue ?? selected ?? 0); // 👈 town ID stored
  
    // Notify parent only when ID changes
  useEffect(() => {
    if (value && value > 0) {
      onChange(value);
    }
  }, [value]);

  const successCallback = useCallback((user: User) => {
    setValue(Number(user.id));  // 👈 store ID from created town
    setOpen(false);
  }, []);

  const selectedMmda = usersQuery.data?.find((t) => t.id === value);

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
            {selectedMmda ? selectedMmda.name : "Select carrier account"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command shouldFilter>
            <CommandInput placeholder="Search accounts..." className="text-xs" />
            <AddAccountDialog successCallback={successCallback} />
            <CommandEmpty>
              <div className="p-2">
                <p className="text-xs">Account not found</p>
                <p className="text-xs text-muted-foreground">
                  Tip: Create a carrier account
                </p>
              </div>
            </CommandEmpty>

            <CommandGroup>
              <CommandList className="max-h-48 overflow-auto">
                {usersQuery.data?.map((user) => (
                  <CommandItem
                    key={user!.id}
                    value={String(user.name)}
                    onSelect={() => {
                      setValue(Number(user!.id)); // 👈 store ID
                      setOpen(false);
                    }}
                  >
                    <span className="text-xs">{user.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === user.id ? "opacity-100" : "opacity-0"
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

export default AccountPicker;
