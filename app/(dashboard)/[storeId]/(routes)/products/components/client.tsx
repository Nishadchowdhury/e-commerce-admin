'use client'
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/custom/Heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/custom/data-table"
import ApiList from "@/components/ui/custom/api-list"


interface clientProps {
    data: ProductColumn[]
}
const ProductClient: React.FC<clientProps> = ({ data }) => {

    const params = useParams()
    const router = useRouter()




    return (
        <>
            <div className='flex items-center justify-between' >
                {/* head of the page */}
                <Heading
                    title={`Products (${data?.length})`}
                    description="Manage products"
                />

                {/* create a new billboard btn */}
                <Button
                    onClick={() => router.push(`/${params.storeId}/products/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>

            </div>

            <Separator />

            {/* Data table components */}
            <DataTable
                columns={columns}
                data={data}
                searchKey="name"
            />

            <Heading title="API" description="API calls for products." />

            <Separator />

            <ApiList
                entityName="products"
                entityIdName="productId"
            />


        </>
    )

}

export default ProductClient