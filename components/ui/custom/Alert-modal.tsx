'use client'

import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { Button } from "../button";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}
const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null;
    }

    return (
        <Modal
            title="Are you sure?"
            description="This action cannot be undone."
            onClose={onClose}
            isOpen={isOpen}
        >
            <div className="pt-6 space-x-2 flexC justify-end">
                <Button
                    disabled={loading}
                    variant={"outline"}
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    disabled={loading}
                    variant={"destructive"}
                    onClick={onConfirm}
                >
                    Continue
                </Button>

            </div>

        </Modal>
    )

}

export default AlertModal