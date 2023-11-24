import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import avt from "../../assets/avt.jpeg"

const ChatItem = ({navigation,friend}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("chat",{
        friendName:friend.name,
        friendAvatar: friend.avatar,
        friendEmail: friend.email,
    })} className="mx-4 mt-1">
        <View className= "flex-row items-center space-x-4 bg-white my-2 py-2 rounded-lg">
            {friend.avatar !== undefined ? (
                <Image source={{ uri: friend.avatar }} className="h-12 w-12 rounded-full mx-3" />
            ) : (
                <Image source={avt} className="h-12 w-12 rounded-full mx-3" />
            )}
            <View>
                <Text className="tracking-widest font-medium text-lg ">
                    {friend.name}
                </Text>
                <Text className="tracking-tight max-h-7 font-bold text-sm text-gray-500">
                    {friend.lastMessage[0]?.message}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default ChatItem