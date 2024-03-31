'use client'
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/custom/Heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"


interface clientProps {

}
const BillBoardClient: React.FC<clientProps> = () => {

    const params = useParams()
    const router = useRouter()
    

    

    return (
        <>
            <div className='flexC justify-between' >
                <Heading
                    title="Billboards (0)"
                    description="Manage Billboards"
                />
                <Button 
                onClick={()=> router.push(`/${params.storeId}/billboards/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
        </>
    )

}

export default BillBoardClient