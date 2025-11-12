import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface Props {
    title:string,
    handlePress?: ()=> void,
    containerStyles?:string,
    textStyles?:string,
    isLoading?:boolean
}

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}:Props) => {
  return (
    <TouchableOpacity
     onPress={handlePress} 
     activeOpacity={.7}
     className={`bg-secondary rounded-xl justify-center items-center min-h-[62px] ${containerStyles} ${isLoading && "opacity-50"}`}
     disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton