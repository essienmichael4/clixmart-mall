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

export type Banner = {
    id: number,
    bannerId?: string,
    imageName: string,
    imageUrl?:string,
} 

export type Brand = {
    id: number,
    name: string,
    url: string,
    imageUrl?:string,
    categories?: Category[]
} 

export type CategoryList = {
    id:number,
    categoryId?: string,
    name:string,
    imageName?:string,
    imageUrl?:string,
    createdAt:string,
    updatedAt:string,
    subCategories?: Category[]
}

export type Category = {
    id:number,
    categoryId?: string,
    name:string,
    imageName?:string,
    imageUrl?:string,
    createdAt:string,
    updatedAt:string,
    subCategories?: SubCategory[]
}

export type Commission = {
    id: number,
    category: Category,
    rate: number,
    createdAt:string,
    updatedAt:string,
}

export type SubCategory = {
    id:number,
    name:string,
    createdAt:string,
    updatedAt:string,
    secondLevelSubCategories: SecondLevelSubCategory[]
}

export type SecondLevelSubCategory = {
    id:number,
    name:string,
    createdAt:string,
    updatedAt:string,
    thirdLevelSubCategories: ThirdLevelSubCategory[]
}

export type ThirdLevelSubCategory = {
    id:number,
    name:string,
    createdAt:string,
    updatedAt:string,
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

export type NextOfKin = {
    id: number,
    name: string,
    phone: string
}

export type Order = {
    id: number,
    orderId?: string,
    status: string,
    total: number,
    tax: number,
    discount: number,
    createdAt: string,
    updatedAt: string,
    isPaid: string,
    orderItems: OrderItem[],
    user?: User
}

export type OrderItem = {
    id: number,
    orderItemId?: string,
    name: string,
    price: number,
    subTotal: number,
    quantity: number,
    status: string,
    createdAt: string,
    updatedAt: string,
    product: Product
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
    productId?: string,
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
    imageName?:string,
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
    status: "PENDING" | "APPROVED" | "REJECTED",
    description: string,
    user: User
}

export type ProductStats = {
    products: number,
    count: {period: string, statistics: number, products: number},
    revenue: {period: string, statistics: number, revenue: number},
    sold: {period: string, statistics: number, sold: number}
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
    paymentDetail: PaymentDetail,
    nextOfKin: NextOfKin
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

export type Tag = {
    id: number,
    name: string
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
// export type Status 
