import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import CategoryCLient from "./components/client"
import { CategoryColumn } from "./components/columns"

interface CategoriesPageProps {
    params: { storeId: string, billBoardId: string }
}
const CategoriesPage: React.FC<CategoriesPageProps> = async ({ params }) => {

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId,
        },
        include: { // it will find related fields. 
            // it will add as an extra object named "billboard" and that will have all the details of a billboard.
            billboard: true
        },
        orderBy: {
            createdAt: 'desc'
        },
    })


    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        // this is the type safe way to store things in typescript.
        
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label, // accessed the data from the billboard object.
        createdAt: format(item.createdAt, "MMMM do, yyyy")
        // formatting the Date to visible format with "npm i date-fns" (date Data, format type)
    }))



    return (
        <div className='flex-col' >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryCLient data={formattedCategories} />
            </div>
        </div>
    )

}

export default CategoriesPage