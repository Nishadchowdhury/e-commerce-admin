'use client'

import Heading from "@/components/ui/custom/Heading"
import { Separator } from "@/components/ui/separator"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/custom/data-table"



interface clientProps {
    data: OrderColumn[]
}
const OrderClient: React.FC<clientProps> = ({ data }) => {



    return (
        <>
            <div className='flex items-center justify-between' >
                {/* head of the page */}
                <Heading
                    title={`Orders (${data?.length})`}
                    description="Manage orders"
                />
            </div>

            <Separator />

            {/* Data table components */}
            <DataTable
                columns={columns}
                data={data}
                searchKey="label"
            />
        </>
    )

}

export default OrderClient