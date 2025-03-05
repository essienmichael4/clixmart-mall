import { Dispatch, SetStateAction } from "react"

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
    setAuth: Dispatch<SetStateAction<AuthType | undefined>>;
}

export type AnnouncementType = {
    title?:string,
    body:string,
    show: string
}

export type AddressType = {
    id: number,
    name:string,
    contact:string,
    mobile: string,
    address: string
}

export type Brand = {
    id: number,
    name: string,
    url: string,
    categories?: Category[]
} 

export type Category = {
    id:number,
    name:string,
    createdAt:string,
    updatedAt:string,
    subCategories?: Category[]
}

export type LoadingType = {
    id: number,
    vessel?:string,
    loaded?:string,
    eta?: string,
    status: "IN_TRANSIT" | "ARRIVED" | "DELIVERED"
}


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

export type Product = {
    id?: number,
    name: string,
    price: number,
    quantity?: number,
    status: "DRAFT" | "PUBLISH" | "ARCHIVE",
    inventory: "INSTOCK" | "OUTSTOCK",
    discription: string,
    discount: number,
    isDiscounted: "TRUE" | "FALSE"
    createdAt: string,
    updatedAt: string,
    category: Category,
    subCategory: SubCategory,
    user?: User
    store?: Store,
    brand?: Brand,
    tags: Tag[],
    productImages: ProductImage[]
}

export type ProductImage = {
    id: number,
    url: string
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
    name:string,
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
}
