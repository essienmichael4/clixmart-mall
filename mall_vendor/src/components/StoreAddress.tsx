import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel  } from "./ui/form"
import { Input } from "./ui/input"
import { StoreAddressSchema, StoreAddressSchemaType } from "@/schema/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import { toast } from "sonner"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"
import {City, Country, ICity, ICountry, IState, State} from "country-state-city"
import CountryPicker from "./CountryPicker"
import StatePicker from "./StatePicker"
import CityPicker from "./CityPicker"
import { Separator } from "./ui/separator"
import { Store } from "@/lib/types"

interface Props {
    store:Store | undefined,
    formStep:number,
    setFormStep: (value:number)=> void
}

const StoreAddress = ({store, formStep, setFormStep}:Props) => {
    const axios_instance_token = useAxiosToken()
    const countryData = Country.getAllCountries()
    const [stateData, setStateData] = useState<IState[]>()
    const [citiesData, setCitiesData] = useState<ICity[]>()

    const [phone, setPhone] = useState("")
    const [country, setCountry] = useState(countryData[0])
    const [state, setState] = useState<IState | undefined>()
    const [city, setCity] = useState<ICity>()

    useEffect(()=>{
        setState(undefined)
        setCity(undefined)
        form.setValue("state", "")
        form.setValue("city", "")
        country && setStateData(State.getStatesOfCountry(country?.isoCode))
    }, [country])

    useEffect(()=>{
        setCity(undefined)
        form.setValue("city", "")
        state ? setCitiesData(City.getCitiesOfState(country?.isoCode, state!.isoCode)) : setCitiesData(City.getCitiesOfCountry(country?.isoCode))
    }, [state])

    useEffect(()=>{
        stateData && setState(stateData[0])
    }, [stateData])

    useEffect(()=>{
        citiesData && setCity(citiesData[0])
    }, [citiesData])

    const form = useForm({
        resolver: zodResolver(StoreAddressSchema),
        defaultValues:{
            fullname: "",
            phone: "",
            country: "",
            state: "",
            city: "",
            addressLine: "",
            landmark: "",
            zip: ""
        }
    })

    // const handleInputChange = (value:number)=>{
    //     form.setValue("zip", value)
    // }

    const handleCountryChange = (value:ICountry)=>{
        setCountry(value)
        form.setValue("country", value.name)
    }

    const handleStateChange = (value:IState)=>{
        setState(value)
        form.setValue("state", value.name)
    }

    const handleCityChange = (value:ICity)=>{
        setCity(value)
        form.setValue("city", value.name)
    }



    const addStoreAddress = async (data:StoreAddressSchemaType)=>{
            const response = await axios_instance_token.post(`/stores/${store?.id}/store-address`, {
                ...data
            },)
    
            return response.data
        }

    const {mutate, isPending} = useMutation({
        mutationFn: addStoreAddress,
        onSuccess: (data)=>{
            toast.success("Store address added successfully", {
                id: "create-store"
            })

            form.reset({
                country: data.country,
                state: data.state,
                fullname: data.name,
                phone: data.phone,
                landmark: data.landmark,
                addressLine: data.addressLine,
                city: data.city,
                zip: data.zip
            })

            setFormStep(formStep+1)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "create-store"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "create-store"
                })
            }
        }
    })
    
    const onSubmit = async (data:StoreAddressSchemaType) =>{
        toast.loading("Updating store address...", {
            id: "create-store"
        })
        mutate(data)
    }

    return (
        <div className="border w-full md:w-2/3 lg:w-2/4 p-4 rounded-lg mb-12">
            <h3 className="text-xl font-semibold mb-2">Store Address Information</h3>
            <Separator />
            <Form {...form}>
                <form className='md:w-full  mt-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                        <FormField 
                            control={form.control}
                            name="fullname"
                            render={({field}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                            placeholder='Please enter your name' {...field} />
                                    </FormControl>
                                    {/* <FormDescription>National ID card number for identification.</FormDescription> */}
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="phone"
                            render={({}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>Phone</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            country="gh"
                                            value={phone}
                                            onChange={(value)=>setPhone(value)}
                                            onBlur={()=>form.setValue("phone", phone)}
                                            containerStyle={{
                                                width: "100%",
                                                border: "1 px solid #ebebeb"
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>Contact to be reached on.</FormDescription>
                                </FormItem>
                            )}
                        />

                    </div>

                    <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                        <FormField 
                            control={form.control}
                            name="country"
                            render={({}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>Country</FormLabel>
                                    <FormControl>
                                        <CountryPicker data={countryData} selected={country} onChange={handleCountryChange}/>
                                    </FormControl>
                                    {/* <FormDescription>National ID card number for identification.</FormDescription> */}
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="state"
                            render={({}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>State/Region</FormLabel>
                                    <FormControl>
                                        <StatePicker data={stateData} selected={state} onChange={handleStateChange}/>
                                    </FormControl>
                                    {/* <FormDescription>National ID card number for identification.</FormDescription> */}
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                        <FormField 
                            control={form.control}
                            name="city"
                            render={({}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>City</FormLabel>
                                    <FormControl>
                                        <CityPicker data={citiesData} selected={city} onChange={handleCityChange} />
                                    </FormControl>
                                    {/* <FormDescription>National ID card number for identification.</FormDescription> */}
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="addressLine"
                            render={({field}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Street Address</FormLabel>
                                <FormControl>
                                <Input 
                                    className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                    placeholder='Please enter your street address' {...field} />
                                </FormControl>
                                <FormDescription>Address line or street address of location</FormDescription>
                            </FormItem>
                            )} 
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                        <FormField 
                            control={form.control}
                            name="landmark"
                            render={({field}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>Landmark</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                            placeholder='Please enter the nearest landmark to your location' {...field} />
                                    </FormControl>
                                    <FormDescription>Nearest landmark.</FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="zip"
                            render={({field}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>Zip code</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                            placeholder='Please enter your store name' {...field} />
                                    </FormControl>
                                    <FormDescription>Enter 0000 if you're unsure of your zip code.</FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                        
                </form>
            </Form> 
            <div className="mt-4 flex gap-4">
                <Button onClick={()=>setFormStep(formStep - 1)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                    Back
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                >
                    {!isPending && "Next"}
                    {isPending && <Loader2 className='animate-spin' /> }
                </Button>
            </div>
        </div>
    )
}

export default StoreAddress
