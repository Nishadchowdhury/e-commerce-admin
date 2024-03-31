"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Server } from "lucide-react";
import { Badge, BadgeProps } from "../badge";
import { Button } from "../button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin"

}

// TypeScript record :- that maps variant values to corresponding text representations. 
const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin",
}
// textMap: This object maps each variant value to its corresponding text representation. For example, when variant is "public", it returns "Public".

const variantMap: Record<ApiAlertProps["variant"], BadgeProps['variant']> = {
    public: "secondary",
    admin: "destructive",
}
// variantMap: This object maps each variant value to its corresponding CSS class name or style variant. For example, when variant is "admin", it returns "destructive".

// Accessing text and variant mappings based on the variant prop
// const variant = "public";
// console.log(textMap[variant]); // Output: "Public"
// console.log(variantMap[variant]); // Output: "secondary"


const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success("API route copied to the clipboard.");
}



const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    variant = "public"
}) => {


    return (
        <Alert className='' >
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge
                    variant={variantMap[variant]}
                >
                    {textMap[variant]}
                </Badge>
            </AlertTitle>

            <AlertDescription className="mt-4 flex items-center justify-between" >
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold " >
                    {description}
                </code>

                <Button variant={"outline"} size={"icon"} onClick={() => onCopy(description)} >
                    <Copy className="h-4 w-4 " />
                </Button>

            </AlertDescription>

        </Alert>
    )

}

export default ApiAlert