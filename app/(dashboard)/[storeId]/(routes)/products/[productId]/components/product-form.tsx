"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/custom/Heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/ui/custom/Alert-modal";
import ImageUpload from "@/components/ui/custom/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


interface ProductFormProps {
    initialData: Product & { images: Image[] } | null;
    categories: Category[];
    sizes: Size[];
    colors: Color[];
}


const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})


type ProductFormValue = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes,
    colors,
}) => {

    const params = useParams()
    const router = useRouter()



    const title = initialData ? "Edit product" : "Create product"
    const description = initialData ? "Edit a product" : "Add a new product"
    const toastMessage = initialData ? "Product updated" : "Product created"
    const action = initialData ? "Save changes" : "Create"


    // this state for the alert modal, this modal going to hit different API all each time so it is not posable use with _zustand_.
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<ProductFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            colorId: "",
            sizeId: "",
            isFeatured: false,
            isArchived: false,
        },
    })

    const onSubmit = async (data: ProductFormValue) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }

            router.refresh(); 
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh();
            router.push(`/${params.storeId}/products`)
            toast.success("Product delete.")
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
                        name="images"
                        render={({ field }) => {

                            return (
                                <FormItem >
                                    <FormLabel > Images </FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value.map((image) => image.url)}
                                            disabled={loading}
                                            onChange={(url) => field.onChange([...field.value, { url }])}
                                            onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                        />
                                    </FormControl>
                                </FormItem>
                            )
                        }}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => {

                                return (
                                    <FormItem>
                                        <FormLabel > Name </FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => {

                                return (
                                    <FormItem>
                                        <FormLabel > Price </FormLabel>
                                        <FormControl>
                                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => {

                                return (
                                    <FormItem >
                                        <FormLabel > Categories </FormLabel>

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
                                                        placeholder="Select a category."
                                                    >
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {
                                                    categories?.map(category => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => {

                                return (
                                    <FormItem >
                                        <FormLabel > Size </FormLabel>

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
                                                        placeholder="Select a category."
                                                    >
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {
                                                    sizes?.map(size => (
                                                        <SelectItem
                                                            key={size.id}
                                                            value={size.id}
                                                        >
                                                            {size.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => {

                                return (
                                    <FormItem >
                                        <FormLabel >Color </FormLabel>

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
                                                        placeholder="Select a color."
                                                    >
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {
                                                    colors?.map(color => (
                                                        <SelectItem
                                                            key={color.id}
                                                            value={color.id}

                                                        >
                                                            <div className="flex items-center justify-start gap-2">
                                                                {color.name}
                                                                <span className="h-6 w-6 inline-block rounded-full border"
                                                                    style={{ backgroundColor: color.value }}
                                                                />
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>


                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => {

                                return (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 rounded-md border ">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Featured
                                            </FormLabel>
                                            <FormDescription>
                                                This product will appear on the home page.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => {

                                return (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 rounded-md border ">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Featured
                                            </FormLabel>
                                            <FormDescription>
                                                This product will no appear anywhere in the store.
                                            </FormDescription>
                                        </div>
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

export default ProductForm
