# Zustand

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

// src => https://youtu.be/_ngCLZ5Iz-0