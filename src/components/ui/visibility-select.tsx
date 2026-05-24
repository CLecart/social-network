"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Lock, Users } from "lucide-react";
import { Visibility } from "@prisma/client";

interface VisibilitySelectProps {
  readonly value: Visibility;
  readonly onChange: (value: Visibility) => void;
  readonly id?: string;
}

const visibilityOptions = [
  {
    value: Visibility.PUBLIC,
    label: "Public",
    description: "Tout le monde peut voir ce post",
    icon: Globe,
  },
  {
    value: Visibility.FRIENDS,
    label: "Amis seulement",
    description: "Seuls vos amis peuvent voir ce post",
    icon: Users,
  },
  {
    value: Visibility.PRIVATE,
    label: "Privé",
    description: "Vous seul pouvez voir ce post",
    icon: Lock,
  },
];

export function VisibilitySelect({ value, onChange, id }: VisibilitySelectProps) {
  const selectedOption = visibilityOptions.find(option => option.value === value);

  return (
    <Select value={value} onValueChange={(newValue) => onChange(newValue as Visibility)}>
      <SelectTrigger id={id} className="w-35 h-8 text-xs bg-(--bgLevel2) border-(--detailMinimal)">
        <SelectValue>
          <div className="flex items-center gap-2">
            {selectedOption && (
              <>
                <selectedOption.icon className="h-3 w-3" />
                <span>{selectedOption.label}</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-(--bgLevel1) border-(--detailMinimal)">
        {visibilityOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="hover:bg-(--bgLevel2) focus:bg-(--bgLevel2)"
          >
            <div className="flex items-center gap-3">
              <option.icon className="h-4 w-4 text-(--textNeutral)" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-(--textNeutral)">{option.description}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}