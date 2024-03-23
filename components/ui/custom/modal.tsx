'use client'

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";


interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {

    const [show, setShow] = useState(false)

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    useEffect(() => {
        setShow(true)
    }, [])


    if (!show) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div>
                    {children}
                </div>

            </DialogContent>
        </Dialog>
    );
};
