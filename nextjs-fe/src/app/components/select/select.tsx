import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface props {
    data: string[];
    label: string;
    selected: string | "";
    onChange: (value: string) => void;
}

export default function SelectOption({ data, label, selected, onChange }: props) {

    return (
        <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4 text-black">
            <Select
                className="max-w-xs text-black"
                labelPlacement="outside-left"
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Select ${label}`}
            >
                {data?.map((d) => (
                    <SelectItem key={d} className="text-black" value={d}>
                       {d}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}
