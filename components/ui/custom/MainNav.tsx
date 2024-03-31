"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const pathName = usePathname();
    const params = useParams();


    const routes = [
        {
            href: `/${params.storeId}`,
            label: "Overview",
            active: pathName === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/settings`,
            label: "settings",
            active: pathName === `/${params.storeId}/settings`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: "Billboards",
            active: pathName === `/${params.storeId}/billboards`
        }
    ];

    return (
        <nav
            className={cn("flexC space-x-4 lg:space-x-6", className)}
        >
            {
                routes.map(({ href, label, active }, i) => {
                    return (
                        <Link
                            href={href}
                            key={i}
                            className={cn("text-sm font-medium transition-colors hover:text-primary",
                                active ? "text-black dark:text-white" : "text-muted-foreground"
                            )}
                        >
                            {label}
                        </Link>
                    )
                })
            }
        </nav>
    )
}
export default MainNav