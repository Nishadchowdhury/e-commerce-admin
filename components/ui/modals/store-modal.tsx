'use client'

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import axios from 'axios'

import { useStoreModal } from "@/hooks/zustand/use-store-modal"
import { Modal } from "@/components/ui/custom/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../button"
import toast from "react-hot-toast"

const formSchema = z.object({
    name: z.string().min(1)
})

export default function StoreModal() {
    // zustand model
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);


            const response = await axios.post('/api/stores', values)

            toast.success("Store created.")

            if (response.data.id) {
                window.location.assign(`/${response.data.id}`)
                // using window.location.assign instead _redirect_ because it will refresh the page properly.
            }

        } catch (error) {
            console.log(error);
            toast.error("something is wrong.")

        } finally {
            setLoading(false);
        }

    }

    return (
        <Modal
            title="Create store"
            description="lorem ipsum dolor sit amet, consectet"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel >Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="E-commerce"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage
                                        />

                                    </FormItem>
                                )}
                            />

                            <div className="pt-6 space-x-2 flexC justify-end w-full">
                                <Button
                                    onClick={storeModal.onClose}
                                    variant={"outline"}
                                    type="button"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={loading}

                                >
                                    Continue
                                </Button>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};
