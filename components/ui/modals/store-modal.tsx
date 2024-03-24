'use client'

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


import { useStoreModal } from "@/hooks/zustand/use-store-modal"
import { Modal } from "@/components/ui/custom/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../button"

const formSchema = z.object({
    name: z.string().min(1)
})

export default function StoreModal() {

    const storeModal = useStoreModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        // TODO: Create store
        console.log(values)

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
                                            <Input placeholder="E-commerce" {...field} />
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
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"

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
