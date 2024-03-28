import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import SettingForm from "./components/SettingForm";

interface SettingPageProps {
    params: {
        storeId: string
    }
}

// params = we're using server component so we'll receive the params automatically.
const SettingPage: React.FC<SettingPageProps> = async ({ params }) => {


    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in")
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    })

    // were set a redirect before rendering SettingForm so props will not complain about the null condition of store.
    if (!store) {
        redirect("/")
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                {/* this setting form will be used on in the setting page so can create this comp in its root. */}
                <SettingForm initialData={store} />
            </div>
        </div>
    )
}

export default SettingPage;