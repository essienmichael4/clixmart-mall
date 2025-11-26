import { Dispatch, SetStateAction } from "react"

export type AuditLog = {
    id: number;
    action: string;
    context: string | null;
    isError: boolean;
    errorMessage?: string | null;
    data?: any;
    performedBy?: { id: number; name: string };
    createdAt: string;
}

export type Ledger = {
  day: number;
  month: number;
  year: number;
  totalCommission: string;
  totalTax: string;
  totalShipping: string;
  createdAt: string;
}

export type AccountLedger = {
    id: number,
    account?: { id: number, accountId: string },
    storeAccount?: { id: number, accountId: string },
    payout?: Payouts,
    type: string,
    amount: number,
    balanceAfter: number,
    description: string,
    reference: string,
    createdAt: string
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

export type CommissionTransaction = {
    id: number,
    saleAmount: number,
    commissionRate: number,
    commissionAmount: number,
    vendorEarning: number,
    isPaid: boolean,
    isReversed: boolean,
    reversalReason?: string,
    reversedAt?:string,
    reversalReferenceId?:number,
    createdAt:string,
    updatedAt:string,
    processedStatus?:string,
    orderItem: OrderItem,
    vendor: User,
}

export type Data = {
    data: User[] | AuditLog[] | Ledger[] | AccountLedger[] | Department[] | Commission[] | CommissionTransaction[] | Hub[] | HubType[] | Mmda[] | Town[],
    meta: Meta
}

export type Department = {
    id: number,
    name: string,
    description?: string,
    createdAt: string,
    updatedAt: string,
    admins?: User[]
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

export type Hub = {
    id: number,
    name: string,
    code: string,
    location: string,
    address?: string,
    isActive: boolean,
    manager?: User,
    latitude?: number,
    longitude?: number,
    types: HubType[],
    createdAt: string,
    updatedAt: string,
    deletedAt?: string,
    region?: Region,
    mmda?: Mmda,
    town?: Town,
    users?: User[],
    deliveries?: string[],
    pickupDeliveries?: string[],

}

export type HubType = {
    id: number,
    name: string,
    description?: string,
    createdAt: string,
    updatedAt: string,
    hubs?: Hub[],
}

export type LoadingType = {
    id: number,
    vessel?:string,
    loaded?:string,
    eta?: string,
    status: "IN_TRANSIT" | "ARRIVED" | "DELIVERED"
}

export type Meta = {
    page: number
    take: number
    itemCount: number
    pageCount?: number
    hasPreviousPage?: boolean
    hasNextPage?: boolean
}

export type Mmda = {
    id: number,
    name: string,
    type?: string,
    capital?: string,
    code?: string, 
    region?: Region,
    towns?: Town[],
    hubs?: Hub[],
    createdAt: string,
    updatedAt: string,
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
    options: ProductOption[],
    specifications: ProductSpecification[],
    tags: Tag[],
    productImages: ProductImage[],
    productReview?: ProductReview
}

export type ProductOption = {
    id: number,
    name: string,
    values: ProductOptionValue[]
}

export type ProductOptionValue = {
    id: number,
    value: string
}

export type ProductSpecification = {
    id: number,
    name: string,
    value: string
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

export type Region = {
    id: number,
    name: string,
    mmdas?: Mmda[],
    hubs?: Hub[],
    createdAt: string,
    updatedAt: string,
}   

export type Store = {
    id: number,
    storeId?: string,
    name: string,
    url: string,
    unspacedName:string,
    createdAt: string,
    updatedAt: string,
    processedRevenue: number,
    payments: Payouts[],
    user?: User,
    storeAccount?: StoreAccount,
    storeDetail?: StoreDetail,
    storeReview?: StoreReview,
    storeAddress?: StoreAddress,
    paymentDetail: PaymentDetail,
    nextOfKin: NextOfKin
} 

export type Payouts = {
    id: number,
    paidBy: User,
    totalAmount: number,
    status:string,
    createdAt:string,
    store: Store
}

export type StoreAccount = {
    id: number,
    storeAccountId: string,
    currentAccount: number,
    due: number,
    unpaid: number,
    store: Store
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

export type Tax = {
    id: number,
    taxPercent: number,
    createdAt?: string,
    updatedAt?:string,
}

export type Town = {
    id: number,
    name: string,
    postcode?: string,
    landmark?: string,
    latitude?: string,
    longitude?: string,
    mmda?: Mmda,
    hubs?: Hub[],
    createdAt: string,
    updatedAt: string,
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

export type VendorPayout = {
    vendor: User,
    transactions: CommissionTransaction[],
    totalAmount: number,
    createdAt?: string,
    updatedAt?:string,
    paidAt?:string,
    status:string
}
// export type Status 
