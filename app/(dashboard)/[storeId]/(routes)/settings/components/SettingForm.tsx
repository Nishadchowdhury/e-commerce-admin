"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
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
import ApiAlert from "@/components/ui/custom/Api-alert";
import { useOrigin } from "@/hooks/custom/use-origin";


interface SettingFormProps {
    initialData: Store;
}


const formSchema = z.object({
    name: z.string().min(1)
})


type SettingFormValue = z.infer<typeof formSchema>;

const SettingForm: React.FC<SettingFormProps> = ({
    initialData
}) => {

    const params = useParams()
    const router = useRouter()

    const origin = useOrigin() //custom
    
    // this state for the alert modal, this modal going to hit different API all each time so it is not posable use with _zustand_.
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SettingFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })

    const onSubmit = async (data: SettingFormValue) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh(); // is refresh the page like hot reload and changes all the things are need to be updated.
            toast.success("Store updated.")
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
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push('/')
            toast.success("Store delete.")
        } catch (error) {
            toast.error("Make sure you removed all the products and category first.");
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
            <div className="flex items-center justify-between">
                <Heading
                    title="Setting"
                    description="Manage store preferences"
                />
                <Button
                    disabled={loading}
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => setOpen(true)}

                >
                    <Trash className="h-4 w-4" />
                </Button>
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
                                            <Input disabled={loading} placeholder="Store name" {...field} />
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
                        Save changes
                    </Button>

                </form>
            </Form>
            <Separator />
            <ApiAlert
                title="NEXT_PUBLIC_API_URL"
                variant="public"
                description={`${origin}/api/${params.storeId}`}
            />
        </>
    )

}

export default SettingForm
