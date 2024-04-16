import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import BillBoardClient from "./components/client"
import { BillboardColumn } from "./components/columns"

interface pageProps {
    params: { storeId: string, billBoardId: string }
}
const page: React.FC<pageProps> = async ({ params }) => {

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc'
        },
    })


    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        // this is the type safe way to store things in typescript.

        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
        // formatting the Date to visible format with "npm i date-fns" (date Data, format type)
    }))



    return (
        <div className='flex-col' >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillBoardClient data={formattedBillboards} />
            </div>
        </div>
    )

}

export default page