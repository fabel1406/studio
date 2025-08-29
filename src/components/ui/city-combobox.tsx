// src/components/ui/city-combobox.tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getCitiesByCountry, type City } from "@/lib/locations"

interface CityComboboxProps {
  country: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}

export function CityCombobox({ country, value, setValue, disabled }: CityComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [cities, setCities] = React.useState<City[]>([]);

  React.useEffect(() => {
    if (country) {
      setCities(getCitiesByCountry(country));
    } else {
      setCities([]);
    }
  }, [country]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? cities.find((city) => city.name === value)?.name
            : "Selecciona una ciudad..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Busca una ciudad..." />
          <CommandList>
            <CommandEmpty>No se encontró ninguna ciudad.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.name}
                  value={city.name}
                  onSelect={() => {
                    setValue(city.name === value ? "" : city.name)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
