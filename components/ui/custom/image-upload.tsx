"use client"

import { ImagePlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../button";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}
const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
}) => {


    //hydration error solve
    const [isMounted, setIsMounted] = useState(false); useEffect(() => { setIsMounted(true) }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    if (!isMounted) { return null }

    return (
        <div className='' >
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => {
                    return (
                        <div
                            key={url}
                            className="relative w-[200px] h-[200px] rounded-md overflow-hidden "
                        >
                            <div className="z-10 absolute top-2 right-2">
                                <Button
                                    // disabled={loading}
                                    type="button"
                                    variant={"destructive"}
                                    size={"icon"}
                                    onClick={() => onRemove(url)}

                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                               
                            </div>
                            <Image
                                    fill
                                    className="object-cover"
                                    alt="Image"
                                    src={url}
                                />
                        </div>
                    )
                })}
            </div>

            <CldUploadWidget
                onUpload={onUpload}
                uploadPreset="qg9ahozx" // it is for security purposes, that who can CRUD on your assets. Signing Mode: "unsigned" // save and out the name of preset here.

            >
                {({ open }) => { // this will render an image uploader of cloudinary through CDN.
                    const onClick = () => {
                        open()
                    }

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            onClick={onClick}

                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )

}

export default ImageUpload


// npm install next-cloudinary +++++++++++++++++ setting up
// https://youtu.be/5miHyP6lExg?si=_wtq4HQrfw5OHVuN&t=14289