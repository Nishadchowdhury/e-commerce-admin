================================================================

# Zustand

================================================================
it provides global state _(basics)_

1. we need a store to store all the state.
2. we need to create+export a function like -> export const useCounterStore = create<propsType>(()=>({
   count:0,
   }))
   // we use the create function to create a variable.
   // eventually it returns a custom hook _useCounterStore_ and we can use it in any component.

with dispatch functions -> export const useCounterStore = create<propsType>((set)=>({
count:0,
decrement:()=>{
set((state)=> ({count:state.count - 1}))
}

}))

3. we can import the hook and use the selector like -> const count = useCounterStore((state)=> state.count);
   besides we can store the dispatch function like -> const decrement = useCounterStore((state)=> state.decrement)

For asynchronous state updates _(advance)_

with asynchronous dispatch functions -> export const useCounterStore = create<propsType>((set)=>({
count:0,
incrementAsync:()=>{
await new Promise((resolve,reject)=>{
setTimeout(resolve,1000);
})
set((state)=> ({count:state.count + 1}))
}

}))

it is not important to use the custom hook as a hook all the time. Because we might need to access the state from a random function; so we can do this like -> _const count = useCounterStore.getState().count;_
// to set value -> _const count = useCounterStore.setState({count:1})_.

best practices _(advance)_

access the specific state only otherwise -> const {count} = useCounterStore((state)=> state); // this will be less performant because the state will import all the states and rerender the component when one of the states gets update.

whenEver we make a store we need to group them in specific features. Because a giant store can be a nightmare to maintain.
So keeping stores modular is good. fotEg:- we can create a different store for authentication only.

# // src => https://youtu.be/_ngCLZ5Iz-0

# modal

================================================================
I want to trigger a modal from many routs and places of the project so I need a modal provider.

1. I need to create a provider and handle hydration error first because there are some components that are server components so hydration errors can easily occur.
2. # we need to import that modal into the provider and then place it on the same level of rootLayout's children.

# react hook form and Zod

================================================================

introduction of RHF _(intro)_
There are something in react that shouldn't be handled with default behavior so we need to prevent it; which makes our dev experience bad. Here RFH comes and solves many problems like preventing native behaviors, besides it helps us to create performant and complex forms.
forEg:- We can crete a form with 2 inputs so we need to create 2 states and place the value to the fields and grab onChange. So if we need to make the from more complex as add 2 more inputs we need to create more states and place the values and grab onChanges which is not a scalable way and the error and loading states handling will be a nightmare. But with RHF we can scale much more easily _let's explore_.

it provides easy from building _(basics)_

1. import _useForm_ and -> const {register, handleSubmit, setError,formState: {errors, isSubmitting}} = useForm<FormFieldsInterface>();
   -> <input {...register("name")} /> // so everything will be handled by RHF.

2. we need to create an _onSubmit function_ that will receive the from data in a prop _data_ -> <form onSubmit={handleSubmit(onsubmitFunction)}>

3. for validation we can send many more properties
   -> <input {...register("name",
   {
   required: "theErrorMessage", // type the error message for custom error messages.
   minLength: 8,
   pattern: /regEx/,
   validate: (value) => value.includes("@gmail.com") // for custom validation.

   // validate: (value) => {
   if(!value.includes("@gmail.com")){
   return "theErrorMessage"
   }
   return true;
   } // for custom validation with message.

}
)} />

exaggerate the form _(advance)_

4. to access the errors -> {errors.name.message} // in error messages the required error message will be prioritized.
5. The loading states -> if we use an asynchronous function to post the data to an API then we need to get the _loading State_ from calls "isSubmitting".

6. send the serverSide errors to RHF error store -> we can use this function _setError_ -> setError("name",{
   message: "errorMessage"
   })
   // also we can use "root" to set a root error that will not an error of any input field; and we can access the error {errors.root}

7. the default values -> useForm<FormFieldsInterface>({
   defaultValues:{
   name: "Nick"
   }
   });
   // only need to set the default values to the fields that we want to display.
   ================================================================

# zod & resolver

================================================================
these provide validations _(intro)_

We need actually two different libraries ->

1. with RHF we need to use zod for validations, this is the recommended way and it's works very well with RHF/resolvers in RHF forms .
2. resolvers that gives some resolvers that can be plugged into the form.

ZOD ->

1. we need to create the schema first of our form fields
   -> const schema = z.object({
   name: z.string().min(1),
   email: z.string().email(),
   })

2. we don't need the FormFields = { email: string; name: string; } instead we can infer from the schema directly.

type FormFields = z.infer<typeof schema> // the from will be infer from the schema.

3. we need to pass resolver ->
   const {
   register,
   handleSubmit,
   setError,
   formState: {errors, isSubmitting}

} = useForm<FormFieldsInterface>({
defaultValues:{
name: "Nick"
},
resolver: zodResolver(schema) // zodResolver comes form RHFresolver.
});

4. we can now remove all the validation from the input fields
   from -> <input {...register("name",
   {
   required: "theErrorMessage", // type the error message for custom error messages.
   minLength: 8,
   pattern: /regEx/,
   validate: (value) => value.includes("@gmail.com") // for custom validation.

   // validate: (value) => {
   if(!value.includes("@gmail.com")){
   return "theErrorMessage"
   }
   return true;
   } // for custom validation with message.

}
)} />

to -> <input {...register("name")} />

================================================================
in shadcn
================================================================

<Form {...form} >
<form onSubmit={form.handleSubmit(onSubmit)}>
<FormField
control={form.control}
name="name"
render={({ field }) => (
<FormItem >
<FormLabel >Name</FormLabel>
<Input placeholder="P-holder" {...field} />
</FormItem>
)}
/>
</form>
</Form>


================================================================
click to copy to the clipboard
================================================================
const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success("API route copied to the clipboard.");
}

calling this will do.

