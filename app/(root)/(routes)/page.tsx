'use client'

import { useStoreModal } from "@/hooks/zustand/use-store-modal"
import { useEffect } from "react";


export default function SetupPage() {

  const onOpen = useStoreModal((state) => state.onOpen);
  const onClose = useStoreModal((state) => state.onClose);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])


  return (
    <div>
      root Page
    </div >
  )
}
