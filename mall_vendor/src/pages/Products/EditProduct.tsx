import useAxiosToken from "@/hooks/useAxiosToken"
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { ProductDetailsSchema, ProductDetailsSchemaType } from "@/schema/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Product } from "@/lib/types"
import Tiptap from "@/components/RichTextEditor/Tiptap"
import CategoryPicker from "@/components/CategoryPicker"
import SubCategoryPicker from "@/components/SubCategoryPicker"
import { useState } from "react"
import { Loader2, Percent, Plus } from "lucide-react"
import BrandPicker from "@/components/BrandPicker"
import Tags from "@/components/Tags"
import PrimaryImage from "./PrimaryImage"
import SecondaryImages from "./SecondaryImages"

const EditProduct = () => {
    const {store, id} = useParams()
    const [tag, setTag] = useState('')
    const [discount, setDiscount] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    
    const handleCategoryChange = (value:string)=>{
        form.setValue("category", value)
        setCategory(value)
    }
    
    const productDetail = useQuery<Product>({
        queryKey: ["products", store, id],
        queryFn: async() => await axios_instance_token.get(`/products/store/${store}/${id}`).then(res => {
            return res.data
        })
    })
    
    const [category, setCategory] = useState(productDetail.data?.name || "")
    
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

    const form = useForm<ProductDetailsSchemaType>({
        resolver:zodResolver(ProductDetailsSchema),
        defaultValues:{
            model: productDetail.data?.model || "",
            category: productDetail.data?.category.name || "",
            subCategory: productDetail.data?.subCategory.name || "",
            brand: productDetail.data?.brand?.name || ""
        }
    })

    const addProductdetails = async (data:ProductDetailsSchemaType)=>{
        const response = await axios_instance_token.post(`/products/${store}/${id}/product-details`, {
            ...data,
            tags,
            discount
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addProductdetails,
        onSuccess: ()=>{
            toast.success("Product added successfully", {
                id: "edit-product"
            })

            form.reset({
                // name: "",
            })

            queryClient.invalidateQueries({queryKey: ["products"]})
            navigate(`../products/${store}`)
            // setOpen(prev => !prev)
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
            <div className="flex justify-between flex-wrap mb-4 lg:mb-0 px-4 mt-4">
                <h2 className="text-2xl">Edit Product</h2>
                <div className="space-x-2">
                    <PrimaryImage id={Number(id)} trigger={<Button variant={"outline"}><Plus /> Add Primary Image</Button>} />
                    <SecondaryImages id={Number(id)} trigger={<Button variant={"outline"}><Plus /> Add Other Images</Button>} />
                </div>
            </div>
            <Form {...form}>
                <form className="p-4 mt-4">
                    <div className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full space-y-2">
                                <h3 className="capitalize text-5xl">{productDetail.data?.name}</h3>
                                {/* <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) =>(
                                        <FormItem className='flex-1 space-y-1'>
                                            <FormLabel className='text-xs'>Product Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="py-4"/>
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                /> */}

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) =>(
                                        <FormItem className='flex-1 space-y-1'>
                                            <FormLabel className='text-xs'>Description</FormLabel>
                                            <FormControl>
                                                <Tiptap onChange={field.onChange} />
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
                                        // control={form.control}
                                        name="discount"
                                        render={({}) =>(
                                            <FormItem className='flex-1 space-y-1'>
                                                <FormLabel className='text-xs'>Discount</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-1">
                                                        <Input onChange={(e)=>setDiscount(e.target.value)} className="py-4"/> <Percent className="w-8 h-8 bg-gray-300 rounded-md p-2" />
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
                                    {!isPending && "Add Product Details"}
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
                                                <CategoryPicker onChange={handleCategoryChange} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />

                                <FormField
                                    control={form.control}
                                    name="subCategory"
                                    render={({field}) =>(
                                        <FormItem className='flex-1 space-y-1'>
                                            <FormLabel className='text-xs'>Product Sub-Category</FormLabel>
                                            <FormControl>
                                                <SubCategoryPicker category={category} onChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />

                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({field}) =>(
                                        <FormItem className='flex-1 space-y-1'>
                                            <FormLabel className='text-xs'>Product Brand</FormLabel>
                                            <FormControl>
                                                <BrandPicker onChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                                
                                <div className="space-y-2">
                                    <h4 className="text-xs">Images</h4>
                                    <div className="aspect-square border rounded-lg flex">

                                    </div>
                                    <div className="flex w-full justify-between">
                                        <div className="aspect-square w-[18%] rounded-lg border"></div>
                                        <div className="aspect-square w-[18%] rounded-lg border"></div>
                                        <div className="aspect-square w-[18%] rounded-lg border"></div>
                                        <div className="aspect-square w-[18%] rounded-lg border"></div>
                                        <div className="aspect-square w-[18%] rounded-lg border"></div>
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

export default EditProduct
