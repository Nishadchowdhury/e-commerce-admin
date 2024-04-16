"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/custom/image-upload";


interface BillboardFormProps {
    initialData: Billboard | null; // we added null because will operate some conditional operations.
}


const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})


type BillboardFormValue = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {

    const params = useParams()
    const router = useRouter()



    const title = initialData ? "Edit billboard" : "Create billboard"
    const description = initialData ? "Edit a billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard updated" : "Billboard created"
    const action = initialData ? "Save changes" : "Create"


    // this state for the alert modal, this modal going to hit different API all each time so it is not posable use with _zustand_.
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<BillboardFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || { label: "", imageUrl: "" },
    })

    const onSubmit = async (data: BillboardFormValue) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }

            router.refresh(); // is refresh the page like hot reload and changes all the things are need to be updated.
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh();
            router.push(`/${params.storeId}/billboards`)
            toast.success("Billboard delete.")
        } catch (error) {
            toast.error("Make sure you removed all categories using this billboard first.");
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

                    <FormField

                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => {

                            return (
                                <FormItem >
                                    <FormLabel > Background image </FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value ? [field.value] : []}
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={() => field.onChange("")}
                                        />
                                    </FormControl>
                                </FormItem>
                            )
                        }}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField

                            control={form.control}
                            name="label"
                            render={({ field }) => {

                                return (
                                    <FormItem >
                                        <FormLabel > Label </FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Billboard label" {...field} />
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

export default BillboardForm
