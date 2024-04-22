"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
    initialData: Category | null; // we added null because will operate some conditional operations.
    billboards: Billboard[] | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
})

type CategoryFormValue = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const params = useParams()
    const router = useRouter()
    // this state for the alert modal, this modal going to hit different API all each time so it is not posable use with _zustand_.
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit category" : "Create Category"
    const description = initialData ? "Edit a category" : "Add a new category"
    const toastMessage = initialData ? "Category updated" : "Category created"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<CategoryFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || { name: "", billboardId: "" },
    })

    const onSubmit = async (data: CategoryFormValue) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data);
            }

            router.refresh(); // is refresh the page like hot reload and changes all the things are need to be updated.
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success("Category delete.")
        } catch (error) {
            toast.error("Make sure you removed all products using this category first.");
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
                                            <Input disabled={loading} placeholder="Category name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField

                            control={form.control}
                            name="billboardId"
                            render={({ field }) => {

                                return (
                                    <FormItem >
                                        <FormLabel > Billboard </FormLabel>

                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger >
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                        placeholder="Select a billboard."
                                                    >
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {
                                                    billboards?.map(billboard => (
                                                        <SelectItem
                                                            key={billboard.id}
                                                            value={billboard.id}
                                                        >
                                                            {billboard.label}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
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

export default CategoryForm
