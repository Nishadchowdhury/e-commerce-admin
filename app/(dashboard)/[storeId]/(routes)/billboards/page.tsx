import BillBoardClient from "./components/client"

interface pageProps {

}
const page: React.FC<pageProps> = () => {


    return (
        <div className='flex-col' >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillBoardClient />
            </div>
        </div>
    )

}

export default page