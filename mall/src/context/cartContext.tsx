import { axios_instance } from "@/api/axios";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Product } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

type CartItem = {
    id: number,
    quantity: number
}

type ShoppingCartContextType = {
    getItemQuantity: (id:number) => number,
    increaseCartQuanity: (id:number) => void,
    decreaseCartQuantity: (id:number) => void,
    removeFromCart: (id:number) => void,
    getTotalCost: ()=> number,
    cartQuantity: number,
    cartItemsCount: number,
    cartItems: CartItem[]
}

export const ShoppingCartContext = createContext({} as ShoppingCartContextType)

export const ShoppingCartProvider = ({children}: {children: React.ReactNode}) => {
    // const axios_instance_token = useAxiosToken()
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", [])

    const cartQuantity = cartItems.reduce((quantity, item)=> item.quantity + quantity, 0)
    const cartItemsCount = cartItems.length
    const cartItemIds = cartItems.map(item => item.id)
    const cartProducts = useQuery<Product[] | []>({
        queryKey: ["products", cartItems],
        queryFn: async() => await axios_instance.get(`/products/cart/items?filter=${cartItemIds.toString()}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    function getItemQuantity(id: number){
        return cartItems.find(item=> item.id === id)?.quantity || 0
    }

    function getTotalCost(){
        const total = cartItems.reduce((total, item)=>{
                const product = cartProducts.data?.find((product)=> product.id === item.id)
                return total + (product?.price || 0) * item.quantity
            }, 0)
        // })
        return total
    }

    function increaseCartQuanity(id:number){
        setCartItems(currentItems=>{
            if(currentItems.find(item => item.id === id) == null){ 
                return [...currentItems, {id, quantity: 1}]
            }else {
                return currentItems.map(item=>{
                    if(item.id === id){
                        return {...item, quantity: item.quantity + 1}
                    }else{
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id:number){
        setCartItems(currentItems=>{
            if(currentItems.find(item => item.id === id)?.quantity == 1){ 
                return currentItems.filter(item => item.id !== id)
            }else {
                return currentItems.map(item => {
                    if(item.id == id){
                        return {...item, quantity: item.quantity - 1}
                    }else{
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id:number){
        setCartItems(currentItems=>{
            return currentItems.filter(item => item.id !== id)
        })
    }

    return <ShoppingCartContext.Provider value={{
        getItemQuantity, increaseCartQuanity, decreaseCartQuantity, removeFromCart, getTotalCost, cartItems, cartQuantity, cartItemsCount
    }}>
        {children}
    </ShoppingCartContext.Provider>
}

export default ShoppingCartProvider
