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

export type Category = {
    id:number,
    name:string,
    createdAt:string,
    updatedAt:string,
    subCategories?: Category[]
}

export type SubCategory = {
    id:number,
    name:string,
    createdAt:string,
    updatedAt:string,
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

export type User = {
    id: number | null,
    name: string,
    email: string,
    phone?: string,
    role?: string,
    createdAt?: string,
    updatedAt?:string,
    address?: Address
}

export type Address = {
    id: number,
    country?: string,
    state?: string,
    city?: string,
    addressLine?: string,
    landmark?: string,
    zip?: string,
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

export type LoadingType = {
    id: number,
    vessel?:string,
    loaded?:string,
    eta?: string,
    status: "IN_TRANSIT" | "ARRIVED" | "DELIVERED"
}

export type Store = {
    id: number,
    name: string,
    url: string,
    unspacedName:string,
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

export type PaymentDetail = {
    accountName: string,
    accountNumber: string,
    paymentMode: string,
    provider: string
} 


// export type Status 
