import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '@/constants'

interface Props {
    title:string,
    value:string,
    handleChangeText?: (e:string)=> void,
    otherStyles?: string,
    keyboardType?: string,
    placeholder?: string
}

const FormField = ({title, value, handleChangeText, otherStyles, placeholder, ...props}:Props) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>
      <View className='w-full h-16 px-4 bg-black-100 rounded-2xl items-center border-2 flex-row border-black-200 focus:border-secondary'>
        <TextInput 
          className='flex-1 text-white font-psemibold text-base' 
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Password" && 
            <TouchableOpacity 
              onPress={()=>{setShowPassword(!showPassword)}}
            >
                <Image source={showPassword ? icons.eye : icons.eyeHide} resizeMode='contain' className='h-6 w-6' />
            </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default FormField
