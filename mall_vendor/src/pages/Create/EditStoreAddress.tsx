import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel  } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { StoreAddressSchema, StoreAddressSchemaType } from "@/schema/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../../components/ui/button"
import { toast } from "sonner"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"
import {City, Country, ICity, ICountry, IState, State} from "country-state-city"
import CountryPicker from "../../components/CountryPicker"
import StatePicker from "../../components/StatePicker"
import CityPicker from "../../components/CityPicker"
import { Separator } from "../../components/ui/separator"
import { Store } from "@/lib/types"

interface Props {
    store:Store | undefined,
    id: number,
    formStep:number,
    setFormStep: (value:number)=> void
}

const StoreAddress = ({store, id, formStep, setFormStep}:Props) => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const countryData = Country.getAllCountries()
    const [stateData, setStateData] = useState<IState[]>()
    const [citiesData, setCitiesData] = useState<ICity[]>()

    const [phone, setPhone] = useState(store?.storeAddress?.phone || "")
    const [country, setCountry] = useState(countryData.find(country=>{
        if(country.name === store?.storeAddress?.country) return country
    }) ||countryData[0])
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
        stateData && setState(stateData.find(state=>{
            if(state.name === store?.storeAddress?.state) return state
        }) || stateData[0])
    }, [stateData])

    useEffect(()=>{
        citiesData && setCity(citiesData.find(city=>{
            if(city.name === store?.storeAddress?.city) return city
        }) || citiesData[0])
    }, [citiesData])

    const form = useForm({
        resolver: zodResolver(StoreAddressSchema),
        defaultValues:{
            fullname: store?.storeAddress?.fullname || "",
            phone: store?.storeAddress?.phone || "",
            country: store?.storeAddress?.country || "",
            state: store?.storeAddress?.state || "",
            city: store?.storeAddress?.city || "",
            addressLine: store?.storeAddress?.addressLine || "",
            landmark: store?.storeAddress?.landmark || "",
            zip: store?.storeAddress?.zip || ""
        }
    })

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
        const response = await axios_instance_token.patch(`/stores/${id}/store-address`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addStoreAddress,
        onSuccess: ()=>{
            toast.success("Store address updated successfully", {
                id: "create-store"
            })

            queryClient.invalidateQueries({queryKey: ["stores"]})
            queryClient.invalidateQueries({queryKey: ["stores", id]})
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
                <Button onClick={()=>setFormStep(formStep - 1)} disabled={isPending} className='bg-gradient-to-r from-gray-500 to-gray-900 text-white'
                    >
                    Back
                </Button>
                <Button onClick={()=>setFormStep(formStep + 1)} disabled={isPending} className='bg-gradient-to-r from-black/20 to-black text-white'
                    >
                    Skip
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
