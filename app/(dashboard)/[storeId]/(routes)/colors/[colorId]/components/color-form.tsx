"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/custom/Heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/ui/custom/Alert-modal";


interface ColorFormProps {
    initialData: Color | null; // we added null because will operate some conditional operations.
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, { message: "String must be a valid hex code." })
})


type ColorFormValue = z.infer<typeof formSchema>;

const ColorForm: React.FC<ColorFormProps> = ({
    initialData
}) => {

    const params = useParams()
    const router = useRouter()



    const title = initialData ? "Edit color" : "Create color"
    const description = initialData ? "Edit a color" : "Add a new color"
    const toastMessage = initialData ? "Color updated" : "Color created"
    const action = initialData ? "Save changes" : "Create"


    // this state for the alert modal, this modal going to hit different API all each time so it is not posable use with _zustand_.
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<ColorFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || { name: "", value: "" },
    })

    const onSubmit = async (data: ColorFormValue) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data);
            }

            router.refresh(); // is refresh the page like hot reload and changes all the things are need to be updated.
            router.push(`/${params.storeId}/colors`)
            toast.success(toastMessage)
        } catch (error) {

            toast.error("Something went wrong.")
            console.log(error);
        } finally {


            setLoading(false);
        }
    }


    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh();
            router.push(`/${params.storeId}/colors`)
            toast.success("Color deleted.")
        } catch (error) {
            toast.error("Make sure you removed all products using this color first.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>

            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                loading={loading}
                onConfirm={onDelete}
            />
            <div className="flexC justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData &&
                    <Button
                        disabled={loading}
                        variant={"destructive"}
                        size={"icon"}
                        onClick={() => setOpen(true)}

                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                }
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >

                    <div className="grid grid-cols-3 gap-8">
                        <FormField

                            control={form.control}
                            name="name"
                            render={({ field }) => {

                                return (
                                    <FormItem >
                                        <FormLabel > Name </FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Color name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField

                            control={form.control}
                            name="value"
                            render={({ field }) => {

                                return (
                                    <FormItem >
                                        <FormLabel > Value </FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-x-4" >
                                                <Input disabled={loading} placeholder="Color value" {...field} />
                                                <div
                                                    className="border p-4 rounded-full"
                                                    style={{ backgroundColor: field.value }}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )
                            }}
                        />
                    </div>

                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                    >
                        {action}
                    </Button>

                </form>
            </Form>
            <Separator />

        </>
    )

}

export default ColorForm
