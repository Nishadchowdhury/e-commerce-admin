'use client'
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/custom/Heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/custom/data-table"
import ApiList from "@/components/ui/custom/api-list"


interface clientProps {
    data: CategoryColumn[]
}
const CategoryCLient: React.FC<clientProps> = ({ data }) => {

    const params = useParams()
    const router = useRouter()




    return (
        <>
            <div className='flexC justify-between' >
                {/* head of the page */}
                <Heading
                    title={`Categories ${data?.length}`}
                    description="Manage Categories"
                />

                {/* create a new billboard btn */}
                <Button
                    onClick={() => router.push(`/${params.storeId}/categories/new`)}
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

            <Heading title="API" description="API calls for Categories." />

            <Separator />

            <ApiList
                entityName="Categories"
                entityIdName="categoryId"
            />


        </>
    )

}

export default CategoryCLient;