import { ShoppingCartContext } from "@/context/cartContext"
import { useContext } from "react"

const useCart = () => {
  return useContext(ShoppingCartContext)
}

export default useCart
