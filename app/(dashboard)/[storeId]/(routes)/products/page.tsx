import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import ProductClient from "./components/client"
import { ProductColumn } from "./components/columns"
import { formatter } from "@/lib/utils"

interface pageProps {
    params: { storeId: string, productId: string }
}
const page: React.FC<pageProps> = async ({ params }) => {

    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {// include means retrieve all the tables related with the product. in MongoDB it calls populate
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc'
        },
    })


    const formattedProducts: ProductColumn[] = products.map((item) => ({
        // this is the type safe way to store things in typescript.

        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()), // Price is in decimal so I need to convert to number.
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,

        createdAt: format(item.createdAt, "MMMM do, yyyy")
        // formatting the Date to visible format with "npm i date-fns" (date Data, format type)
    }))



    return (
        <div className='flex-col' >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )

}

export default page