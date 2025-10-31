import { axios_instance } from "@/api/axios";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Product } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback } from "react";

type CartItem = {
    id: string,
    quantity: number,
    color?: string;
    size?: string;
}

type ShoppingCartContextType = {
    getItemQuantity: (id:string, color?:string, size?:string) => number,
    increaseCartQuanity: (id:string, color?:string, size?:string) => void,
    decreaseCartQuantity: (id:string, color?:string, size?:string) => void,
    removeFromCart: (id:string, color?:string, size?:string) => void,
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
    // const cartItemIds = cartItems.map(item => item.id)
    const uniqueProductIds = [...new Set(cartItems.map(item => item.id))];
    const cartProducts = useQuery<Product[] | []>({
        queryKey: ["products", uniqueProductIds],
        queryFn: async() => await axios_instance.get(`/products/cart/items?filter=${uniqueProductIds.join(",")}`).then(res => {
            return res.data
        }), enabled: uniqueProductIds.length > 0,
    })

    const generateCartItemKey = (item: Pick<CartItem, "id" | "color" | "size">): string => {
        return `${item.id}_${item.color || "default"}_${item.size || "default"}`;
    };

    // function getItemQuantity(id: string){
    //     return cartItems.find(item=> item.id === id)?.quantity || 0
    // }

    function getItemQuantity(id: string, color?: string, size?: string) {
        const key = generateCartItemKey({ id, color, size });
        return cartItems.find(item => generateCartItemKey(item) === key)?.quantity || 0;
    }

    // function getTotalCost(){
    //     const total = cartItems.reduce((total, item)=>{
    //         const product = cartProducts.data?.find((product)=> product.productId === item.id)
    //         return total + (product?.price || 0) * item.quantity
    //     }, 0)
        
    //     return total
    // }

    const getTotalCost = useCallback(() => {
        return cartItems.reduce((total, item) => {
            const product = cartProducts.data?.find(product => product.productId === item.id);
            return total + (product?.price || 0) * item.quantity;
        }, 0);
    }, [cartItems, cartProducts]);

    function increaseCartQuanity(id:string, color?:string, size?: string){
        const keyToAdd = generateCartItemKey({ id, color, size });
        setCartItems(currentItems=>{
            const itemExists = currentItems.find(item => generateCartItemKey(item) === keyToAdd);

            if (!itemExists) {
                return [...currentItems, { id, color, size, quantity: 1 }];
            } else {
                return currentItems.map(item =>
                    generateCartItemKey(item) === keyToAdd
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                );
            }
            // if(currentItems.find(item => item.id === id) == null){ 
            //     return [...currentItems, {id, quantity: 1}]
            // }else {
            //     return currentItems.map(item=>{
            //         if(item.id === id){
            //             return {...item, quantity: item.quantity + 1}
            //         }else{
            //             return item
            //         }
            //     })
            // }
        })
    }

    function decreaseCartQuantity(id:string, color?:string, size?:string){
        const keyToMatch = generateCartItemKey({ id, color, size });

        setCartItems(currentItems => {
            const foundItem = currentItems.find(item => generateCartItemKey(item) === keyToMatch);

            if (foundItem?.quantity === 1) {
                return currentItems.filter(item => generateCartItemKey(item) !== keyToMatch);
            } else {
                return currentItems.map(item =>
                    generateCartItemKey(item) === keyToMatch
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                );
            }
        });
        // setCartItems(currentItems=>{
        //     if(currentItems.find(item => item.id === id)?.quantity == 1){ 
        //         return currentItems.filter(item => item.id !== id)
        //     }else {
        //         return currentItems.map(item => {
        //             if(item.id == id){
        //                 return {...item, quantity: item.quantity - 1}
        //             }else{
        //                 return item
        //             }
        //         })
        //     }
        // })
    }

    function removeFromCart(id: string, color?: string, size?: string) {
        const keyToMatch = generateCartItemKey({ id, color, size });

        setCartItems(currentItems =>
            currentItems.filter(item => generateCartItemKey(item) !== keyToMatch)
        );
    }
    // function removeFromCart(id:string){
    //     setCartItems(currentItems=>{
    //         return currentItems.filter(item => item.id !== id)
    //     })
    // }

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
