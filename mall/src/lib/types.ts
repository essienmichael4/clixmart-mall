import { Dispatch, SetStateAction } from "react"

interface Action {
    type: "ADD_AUTH" | "REMOVE_AUTH",
    payload?: AuthType
}

export type AddressType = {
    id: number,
    name:string,
    contact:string,
    mobile: string,
    address: string
}

export type Address = {
    id:number,
    addressId?: string
    country?: string,
    city?: string,
    state?: string,
    zip?: string,
    addressLineOne:string,
    addressLineTwo?:string,
    landmark?:string
}

export type AnnouncementType = {
    title?:string,
    body:string,
    show: string
}

export type AuthType = {
    name: string,
    email: string,
    role?: string,
    id: number | undefined,
    backendTokens: {
        accessToken: string,
        refreshToken: string
    }
}

export type AuthContextType = {
    auth: AuthType | undefined,
    dispatch: Dispatch<Action>;
}

export type Brand = {
    id: number,
    name: string,
    url: string,
    categories?: Category[]
} 

export type CategoriesContextType = {
    categories: Category[] | undefined,
    setCategories: Dispatch<SetStateAction<Category[] | undefined>>;
}

export type Category = {
    id:number,
    name:string,
    imageUrl?:string,
    slug:string,
    createdAt:string,
    updatedAt:string,
    subCategories?: SubCategory[]
}

// export type SubCategory = {
//     id:number,
//     name:string,
//     slug:string,
//     createdAt:string,
//     updatedAt:string,
//     subCategories?: Category[]
// }

export type Package = {
    id:number,
    trackingNumber:string,
    cbm:string,
    email:string,
    phone?: string,
    customer: string
    quantity:number,
    loaded?:string,
    received?:string,
    vessel?:string,
    status:string,
    createdAt:string,
    eta?: string,
    package:string
    description?:string
}

export type PaymentDetail = {
    accountName: string,
    accountNumber: string,
    paymentMode: string,
    provider: string
} 

export interface ProductSearchParams {
    q?: string,
    category?: string,
    subCategory?: string,
    brand?: string,
    page?:number,
    take?:number,
}

export interface CategoryProductsSearchParams {
    category?: string,
    subCategories?: string[],
    brand?: string,
    page?:number,
    take?:number,
}

export type Product = {
    id?: number,
    productId: string,
    name: string,
    price: number,
    quantity?: number,
    status: "DRAFT" | "PUBLISH" | "ARCHIVE",
    inventory: "INSTOCK" | "OUTSTOCK",
    description: string,
    discount: number,
    isDiscounted: "TRUE" | "FALSE"
    createdAt: string,
    updatedAt: string,
    imageUrl?:string,
    category: Category,
    subCategory: SubCategory,
    user?: User
    store?: Store,
    brand?: Brand,
    tags: Tag[],
    productImages: ProductImage[],
    productReview?: ProductReview
}

export type ProductImage = {
    id: number,
    url: string,
    imageUrl?: string
}

export type ProductReview = {
    id: number,
    status: "" | "" | "",
    description: string,
    user: User
}

export type Store = {
    id: number,
    name: string,
    url: string,
    slug:string,
    createdAt: string,
    updatedAt: string,
    user?: User,
    storeDetail?: StoreDetail,
    storeReview?: StoreReview,
    storeAddress?: StoreAddress,
    paymentDetail: PaymentDetail
} 

export type StoreDetail = {
    id: number,
    isRegistered: string,
    nationalId: string,
} 

export type StoreReview = {
    id: number,
    status: "PENDING" | "APPROVED" | "REJECTED",
    description?: string,
} 

export type StoreAddress = {
    id: number,
    fullname: string,
    phone?: string,
    country?: string,
    state?: string,
    city?: string,
    addressLine?: string,
    landmark?: string,
    zip?: string,
} 

export type SubCategory = {
    id:number,
    subCategoryId: string,
    name:string,
    slug:string,
    createdAt:string,
    updatedAt:string,
}

export type Tag = {
    id: number,
    name: string
}

export type User = {
    id: number | null,
    name: string,
    email: string,
    role?: string,
    createdAt?: string,
    updatedAt?:string,
    phone?:string,
    addresses?:Address[]
}

export type LoadingType = {
    id: number,
    vessel?:string,
    loaded?:string,
    eta?: string,
    status: "IN_TRANSIT" | "ARRIVED" | "DELIVERED"
}
