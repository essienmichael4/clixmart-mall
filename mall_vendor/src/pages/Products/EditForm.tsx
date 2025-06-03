import BrandPicker from "@/components/BrandPicker"
import CategoryPicker from "@/components/CategoryPicker"
import Tiptap from "@/components/RichTextEditor/Tiptap"
import SubCategoryPicker from "@/components/SubCategoryPicker"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Product } from "@/lib/types"
import { EditProductDetailsSchemaType, EditProductDetailsSchema, ProductDetailsSchemaType } from "@/schema/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Plus, Percent, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import PrimaryImage from "./PrimaryImage"
import SecondaryImages from "./SecondaryImages"
import { Button } from "@/components/ui/button"
import Tags from "@/components/Tags"
import SecondLevelCategoryPicker from "@/components/SecondLevelCategoryPicker"
import ThirdLevelCategoryPicker from "@/components/ThirdLevelCategoryPicker"

interface FormProps {
    product: Product,
    store: string,
    id:string
}

const EditForm = ({product, store, id}: FormProps) => {
    const [tag, setTag] = useState('')
    const [discount, setDiscount] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [activeImage, setActiveImage] = useState("")
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [category, setCategory] = useState("")
    const [subCategory, setSubCategory] = useState("")
    const [secondLevelCategory, setSecondLevelCategory] = useState("")
    const [thirdLevelCategory, setThirdLevelCategory] = useState("")

    useEffect(()=>{
        product.imageUrl ? 
            setActiveImage(product.imageUrl) : 
            product.productImages ? setActiveImage(product.productImages[0].url) : setActiveImage("")
        
        product.tags && setTags(product.tags.map(tag=>tag.name))
        product.discount && setDiscount(product.discount.toString())
    }, [product])

    const handleCategoryChange = (value:string)=>{
        form.setValue("category", value)
        setCategory(value)
    }

    const handleSubCategoryChange = (value:string)=>{
        form.setValue("subCategory", value)
        setSubCategory(value)
    }

    const handleSecondLevelCategoryChange = (value:string)=>{
        setSecondLevelCategory(value)
    }

    const handleThirdLevelCategoryChange = (value:string)=>{
        setThirdLevelCategory(value)
    }

    const handleImageClick = (image: string) => {
        setActiveImage(image)
    }
        
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value)
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const newTag = tag.trim()
        if(tags.length > 9) return
    
        if((e.key==="," || e.key === "Enter" || e.key === "Tab") && newTag.length && !tags.includes(newTag)){
            e.preventDefault()
            setTag("")
            setTags(prev => [...prev, newTag])
        }else if(e.key === "Backspace" && !newTag.length && tags.length){
            e.preventDefault()
            const tagsCopy = [...tags]
            const lastTag:string = tagsCopy.pop() || ""
            setTags(tagsCopy)
            setTag(lastTag)
        }
    }
    
    const removeTag = (index:number) =>{
        setTags(prevTags => {
        return prevTags.filter((_, i)=> i != index)
        })
    }

    const form = useForm<EditProductDetailsSchemaType>({
        resolver:zodResolver(EditProductDetailsSchema),
        defaultValues: product ? {
            name: product.name || "",
            model: product.model,
            category: product.category?.name,
            subCategory: product.subCategory?.name,
            brand: product.brand?.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity
        } : undefined
    })

    const editProductdetails = async (data:ProductDetailsSchemaType)=>{
        const response = await axios_instance_token.patch(`/products/${store}/${id}/product-details`, {
            ...data,
            tags,
            discount,
            secondLevelCategory,
            thirdLevelCategory
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: editProductdetails,
        onSuccess: ()=>{
            toast.success("Product added successfully", {
                id: "edit-product"
            })

            queryClient.invalidateQueries({queryKey: ["products"]})
            navigate(`../products/${store}`)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-product"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-product"
                })
            }
        }
    })

    const onSubmit = (data:ProductDetailsSchemaType)=>{
        toast.loading("Editing product...", {
            id: "edit-product"
        })
        mutate(data)
    }
    
    return (
        <>
            <div className="container mx-auto">
                <div className="flex justify-between flex-wrap mb-4 lg:mb-0 pp-4 mt-4">
                    <h2 className="text-2xl">Edit Product</h2>
                    <div className="space-x-2">
                        <PrimaryImage id={id as string} trigger={<Button variant={"outline"}><Plus /> Add Primary Image</Button>} />
                        <SecondaryImages id={id as string} trigger={<Button variant={"outline"}><Plus /> Add Other Images</Button>} />
                    </div>
                </div>
                <Form {...form}>
                    <form className="py-4 mt-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md: space-y-2">
                                    
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) =>(
                                            <FormItem className='flex-1 space-y-1'>
                                                <FormLabel className='text-xs'>Product Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field}  className="py-4"/>
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />
    
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({field}) =>(
                                            <FormItem className='md:max-w-[400px] lg:max-w-[480px] xl:max-w-[700px] space-y-1'>
                                                <FormLabel className='text-xs'>Description</FormLabel>
                                                <FormControl>
                                                    <Tiptap onChange={field.onChange} defaultValue={field.value} />
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />
    
                                    <FormField
                                        control={form.control}
                                        name="model"
                                        render={({field}) =>(
                                            <FormItem className='flex-1 space-y-1'>
                                                <FormLabel className='text-xs'>Product model</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="py-4"/>
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <FormField 
                                            control={form.control}
                                            name="price"
                                            render={({field}) =>(
                                                <FormItem className='flex-1 space-y-1'>
                                                    <FormLabel className='text-xs'>Price</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="py-4"/>
                                                    </FormControl>
                                                </FormItem>
                                            )} 
                                        />
    
                                        <FormField 
                                            control={form.control}
                                            name="quantity"
                                            render={({field}) =>(
                                                <FormItem className='flex-1 space-y-1'>
                                                    <FormLabel className='text-xs'>Quantity</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="py-4"/>
                                                    </FormControl>
                                                </FormItem>
                                            )} 
                                        />
    
                                        <FormField
                                            name="discount"
                                            render={({}) =>(
                                                <FormItem className='flex-1 space-y-1'>
                                                    <FormLabel className='text-xs'>Discount</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-center gap-1">
                                                            <Input value={discount} onChange={(e)=>setDiscount(e.target.value)} className="py-4"/> <Percent className="w-8 h-8 bg-gray-300 rounded-md p-2" />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )} 
                                        />
                                    </div>
                                    <Tags 
                                        handleChange={handleChange} 
                                        tag={tag}
                                        tags={tags} 
                                        handleKeyDown={handleKeyDown}
                                        removeTag={removeTag}
                                    />
                                    
                                    <h4 className="mt-16 font-semibold text-2xl">Options</h4>
                                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white py-2'
                                    >
                                        {!isPending && "Edit Product Details"}
                                        {isPending && <Loader2 className='animate-spin' /> }
                                    </Button>
                                </div>
                                <div className="w-full md:w-1/2 md:max-w-[350px] md:min-w-[280px] md:px-4 space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={() =>(
                                            <FormItem className='flex-1 space-y-1'>
                                                <FormLabel className='text-xs'>Product Category</FormLabel>
                                                <FormControl>
                                                    <CategoryPicker defaultValue={product?.category?.name} onChange={handleCategoryChange} />
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />
    
                                    <FormField
                                        control={form.control}
                                        name="subCategory"
                                        render={() =>(
                                            <FormItem className='flex-1 space-y-1'>
                                                <FormLabel className='text-xs'>Product Sub-Category</FormLabel>
                                                <FormControl>
                                                    <SubCategoryPicker defaultValue={product?.subCategory?.name} category={category} onChange={handleSubCategoryChange} />
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />

                                    
                                    {subCategory && <FormField
                                        name="secondLevelCategory"
                                        render={() =>(
                                            <FormItem className='flex-1 space-y-1'>
                                                <FormLabel className='text-xs'>Product Second-Level Category</FormLabel>
                                                <FormControl>
                                                    <SecondLevelCategoryPicker subCategory={subCategory} onChange={handleSecondLevelCategoryChange} />
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />}
                                    
                                    {secondLevelCategory && secondLevelCategory !== "" && <FormField
                                        name="thirdLevelCategory"
                                        render={() =>(
                                            <FormItem className='flex-1 space-y-1'>
                                                <FormLabel className='text-xs'>Product Third-Level Category</FormLabel>
                                                <FormControl>
                                                    <ThirdLevelCategoryPicker secondLevelCategory={secondLevelCategory} onChange={handleThirdLevelCategoryChange} />
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />}
    
                                    <FormField
                                        control={form.control}
                                        name="brand"
                                        render={({field}) =>(
                                            <FormItem className='flex-1 space-y-1'>
                                                <FormLabel className='text-xs'>Product Brand</FormLabel>
                                                <FormControl>
                                                    <BrandPicker defaultValue={product.brand?.name} onChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />
                                    
                                    <div className="space-y-2">
                                        <h4 className="text-xs">Images</h4>
                                        <div className="aspect-square border rounded-lg flex overflow-hidden">
                                            <img src={activeImage} alt="" />
                                        </div>
                                        <div className="flex w-full justify-between">
                                        <button onClick={() => handleImageClick(product.imageUrl as string)} className="flex overflow-hidden items-center justify-center w-[18%] aspect-square rounded-lg border">
                                            {product.imageUrl && 
                                                <img src={product.imageUrl} alt="" />
                                            }
                                        </button>
                                        {
                                            product.productImages.map((image, idx) =>{
                                                return <button key={idx}  onClick={() => handleImageClick(image.imageUrl as string)} className="flex overflow-hidden items-center justify-center w-[18%] aspect-square rounded-lg border">
                                                    <img src={image.url} alt="" />
                                                </button>
    
                                            })
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default EditForm
