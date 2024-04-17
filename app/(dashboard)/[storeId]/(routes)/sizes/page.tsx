import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import SizeClient from "./components/client"
import { SizeColumn } from "./components/columns"

interface pageProps {
    params: { storeId: string, billBoardId: string }
}
const page: React.FC<pageProps> = async ({ params }) => {

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc'
        },
    })


    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        // this is the type safe way to store things in typescript.

        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
        // formatting the Date to visible format with "npm i date-fns" (date Data, format type)
    }))



    return (
        <div className='flex-col' >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={formattedSizes} />
            </div>
        </div>
    )

}

export default page