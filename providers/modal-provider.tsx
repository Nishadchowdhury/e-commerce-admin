'use client'

import { useEffect, useState } from "react"

import StoreModal from "@/components/ui/modals/store-modal"

export const ModalProvider = () => { // we need modal provider to add some base things to all its children components. Like mount component.

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])


    if (!isMounted) {
        return null
    }

    return (
        <>
            <StoreModal />
        </>
    )

}