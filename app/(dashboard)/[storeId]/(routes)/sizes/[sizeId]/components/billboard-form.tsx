"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
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


interface SizeFormProps {
    initialData: Size | null; // we added null because will operate some conditional operations.
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
})


type SizeFormValue = z.infer<typeof formSchema>;

const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {

    const params = useParams()
    const router = useRouter()



    const title = initialData ? "Edit size" : "Create size"
    const description = initialData ? "Edit a size" : "Add a new size"
    const toastMessage = initialData ? "Size updated" : "Size created"
    const action = initialData ? "Save changes" : "Create"


    // this state for the alert modal, this modal going to hit different API all each time so it is not posable use with _zustand_.
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SizeFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || { name: "", value: "" },
    })

    const onSubmit = async (data: SizeFormValue) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }

            router.refresh(); // is refresh the page like hot reload and changes all the things are need to be updated.
            router.push(`/${params.storeId}/sizes`)
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
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh();
            router.push(`/${params.storeId}/sizes`)
            toast.success("Size deleted.")
        } catch (error) {
            toast.error("Make sure you removed all products using this size first.");
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
                                            <Input disabled={loading} placeholder="Size label" {...field} />
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
                                            <Input disabled={loading} placeholder="Size label" {...field} />
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

export default SizeForm
