import { axios_instance } from "@/api/axios";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Product } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

type CartItem = {
    id: string,
    quantity: number
}

type ShoppingCartContextType = {
    getItemQuantity: (id:string) => number,
    increaseCartQuanity: (id:string) => void,
    decreaseCartQuantity: (id:string) => void,
    removeFromCart: (id:string) => void,
    getTotalCost: ()=> number,
    emptyCart: () => void,
    cartQuantity: number,
    cartItemsCount: number,
    cartItems: CartItem[]
}

export const ShoppingCartContext = createContext({} as ShoppingCartContextType)

export const ShoppingCartProvider = ({children}: {children: React.ReactNode}) => {
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart", [])

    const cartQuantity = cartItems.reduce((quantity, item)=> item.quantity + quantity, 0)
    const cartItemsCount = cartItems.length
    const cartItemIds = cartItems.map(item => item.id)
    const cartProducts = useQuery<Product[] | []>({
        queryKey: ["products", cartItems],
        queryFn: async() => await axios_instance.get(`/products/cart/items?filter=${cartItemIds.toString()}`).then(res => {
            return res.data
        })
    })

    function getItemQuantity(id: string){
        return cartItems.find(item=> item.id === id)?.quantity || 0
    }

    function getTotalCost(){
        const total = cartItems.reduce((total, item)=>{
            const product = cartProducts.data?.find((product)=> product.productId === item.id)
            return total + (product?.price || 0) * item.quantity
        }, 0)
        
        return total
    }

    function increaseCartQuanity(id:string){
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

    function decreaseCartQuantity(id:string){
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

    function removeFromCart(id:string){
        setCartItems(currentItems=>{
            return currentItems.filter(item => item.id !== id)
        })
    }

    function emptyCart(){
        setCartItems([])
    }

    return <ShoppingCartContext.Provider value={{
        getItemQuantity, increaseCartQuanity, decreaseCartQuantity, removeFromCart, getTotalCost, emptyCart, cartItems, cartQuantity, cartItemsCount
    }}>
        {children}
    </ShoppingCartContext.Provider>
}

export default ShoppingCartProvider
