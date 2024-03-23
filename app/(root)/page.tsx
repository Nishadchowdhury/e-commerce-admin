'use client'

import { Modal } from "@/components/ui/custom/modal"

export default function SetupPage() {
  return (
    <div>
      This is a protected route!
      <Modal title="test" description="Test desc" isOpen onClose={() => { }} >
        Children
      </Modal>
    </div>
  )
}
