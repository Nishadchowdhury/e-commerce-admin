'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ColorColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AlertModal from "@/components/ui/custom/Alert-modal";


interface CellActionProps {
    data: ColorColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const params = useParams()
    const router = useRouter()

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Size Id is copied to the clipboard.");
    }



    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.sizeId}/colors/${data.id}`)
            router.refresh();
            router.push(`/${params.sizeId}/colors`)
            toast.success("Size deleted.")
        } catch (error) {
            toast.error("Make sure you removed all products using this color first.");
            console.log(error);
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }


    return (
        <>

            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />

            <DropdownMenu>

                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="h-8 w-8 p-0" >
                        <span className="sr-only" >  Open Menu </span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" >
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => onCopy(data.id)}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={loading}
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        </>
    );
};