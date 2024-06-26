import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import OrderClient from "./components/client"
import { OrderColumn } from "./components/columns"
import { formatter } from "@/lib/utils"

interface pageProps {
    params: { storeId: string, orderId: string }
}
const page: React.FC<pageProps> = async ({ params }) => {

    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            orderItems: {
                include: {
                    product: true // getting only the related product details.
                }
            },
        },
        orderBy: {
            createdAt: 'desc'
        },
    })


    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        // this is the type safe way to store things in typescript.

        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map(orderItem => orderItem.product.name).join(', '),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + Number(item.product.price)
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
        // formatting the Date to visible format with "npm i date-fns" (date Data, format type)
    }))



    return (
        <div className='flex-col' >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    )

}

export default page