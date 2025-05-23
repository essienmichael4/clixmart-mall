import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link } from 'expo-router'

const SignIn = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = ()=>{}


    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView >
                <View className='w-full justify-center min-h-[82vh] px-4 my-6 '>
                    <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]' />
                    <Text className='text-2xl text-white font-psemibold mt-10'>Log in to Aora!</Text>
                    <FormField 
                      title="Email"
                      value={form.email}
                      handleChangeText={(e:string)=>setForm({...form, email: e})}
                      otherStyles="mt-7"
                      keyboardType="email-address"
                    />
                    <FormField 
                      title="Password"
                      value={form.password}
                      handleChangeText={(e:string)=>setForm({...form, password: e})}
                      otherStyles="mt-7"
                    />

                    <CustomButton
                      title='Sign In'
                      handlePress={submit}
                      containerStyles='mt-7'
                      isLoading={isSubmitting}
                    />

                    <View className='justify-center flex-row gap-2 pt-5'>
                        <Text className='text-lg text-gray-100 font-pregular'>Don't have an account?</Text>
                        <Link href="/sign-up" className='text-lg text-secondary font-pregular'>Sign Up</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn
