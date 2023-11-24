import { View, Text } from 'react-native'
import React from 'react'

const MessageItem = ({item,sender}) => {
    // console.log("sender",sender)
    // console.log("item", item)
  return (
    <View>
        <View style={{ flexDirection: 'row',justifyContent: item.sender === sender ? "flex-end" : "flex-start", padding:10 }}>
        <View style={{ backgroundColor:item.sender === sender ? "#dcf8c6" : "#ffffff", padding:10, borderRadius: 10, maxWidth:'80%', marginRight:10}}>
            <Text className='text-gray-500 text-sm'>{item.sender}</Text>
            <Text className='text-gray-700 text-base'>{item.message}</Text>
         </View>  
         </View>
    </View>
   
  )
}

export default MessageItem