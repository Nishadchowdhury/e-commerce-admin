"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";


export type CategoryColumn = {
    id: string;
    name: string;
    billboardLabel: string;
    createdAt: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "billboard",
        header: "Billboard",
        cell: ({ row }) => row.original.billboardLabel,
    },
    {
        accessorKey: "createdAt",
        header: "Date"
    },
    {
        id: 'actions',
        cell: ({ row }) => ( // row data is a way of tanstack table. It helps to get the data object we're working with.
            <CellAction data={row.original} />
        )
    }
]
