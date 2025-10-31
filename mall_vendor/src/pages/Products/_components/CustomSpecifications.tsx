import { ProductSpecification } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react"
import { useEffect } from "react";

interface Props {
    specifications: { name: string; value: string }[];
    setSpecifications: (values: { name: string; value: string }[]) => void;
    savedSpecifications?: ProductSpecification[]
}

const CustomSpecifications = ({specifications, setSpecifications, savedSpecifications}: Props) => {
    // 🔁 Populate initial values from savedProperties
    useEffect(() => {
        if (
            savedSpecifications &&
            savedSpecifications.length > 0 &&
            specifications.length === 0
        ) {
            setSpecifications(
            savedSpecifications.map(spec => ({
                name: spec.name,
                value: spec.value
            }))
            );
        }
    }, [savedSpecifications]);

    const append = (spec: { name: string; value: string }) => {
        setSpecifications([...specifications, spec])
    }

    const remove = (index: number) => {
        setSpecifications(specifications.filter((_, idx) => idx !== index))
    }

    const updateField = (index: number, key: 'name' | 'value', value: string) => {
        if (key === "name" && specifications.some((s, i) => i !== index && s.name === value)) {
            alert("Specification names must be unique");
            return;
        }
        const updated = [...specifications]
        updated[index][key] = value
        setSpecifications(updated)
    }

    return (
        <div>
            <label className='block font-semibold text-xs'>Custom Specifications</label>
            <div className="flex flex-col gap-3">
                {specifications.map((item, idx)=>(
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 item-center">
                        <div className="flex gap-4 w-full">
                            <div className="flex-1">
                                <label className='block font-semibold text-xs'>Specification Name</label>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateField(idx, "name", e.target.value)}
                                    placeholder="e.g., Battery Life, Weight, Material"
                                    className="border py-2 px-2 rounded w-full text-xs"
                                />
                            </div>
                            <div className="flex-1">
                                <label className='block font-semibold text-xs'>Specification Value</label>
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => updateField(idx, "value", e.target.value)}
                                    placeholder="e.g., 95%, 50kg, Plastic"
                                    className="border py-2 px-2 rounded w-full text-xs"
                                />
                            </div>
                        </div>

                        <button 
                            type="button" 
                            onClick={() => remove(idx)}
                            className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                    </div>
                ))}

                <button 
                    type="button"
                    onClick={() => {
                        const last = specifications[specifications.length - 1];
                        if (last && (!last.name || !last.value)) return;
                        append({ name: "", value: "" });
                    }}
                    className="flex items-center gap-2 text-blue-600 text-xs hover:text-blue-600">
                    <PlusCircle size={16} /> Add Specification
                </button>
            </div>
        </div>
    )
}

export default CustomSpecifications
