import { UserButton, auth } from "@clerk/nextjs";

import MainNav from "@/components/ui/custom/MainNav";
import StoreSwitcher from "@/components/ui/custom/Store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "../toggle-theme";


async function Navbar() {

    const { userId } = auth();


    if (!userId) {
        redirect("/sign-in")
    }


    const stores = await prismadb.store.findMany({
        where: {
            userId
        }
    })

    return (
        <nav>
            <div className="border-b">
                <div className="flexC h-16 px-4">

                    <StoreSwitcher items={stores} />

                    <MainNav className="mx-6" />

                    <div className="ml-auto flexC space-x-4">
                        <ThemeToggle />
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;