import { View, Text, TextInput,Keyboard,TouchableWithoutFeedback,TouchableOpacity,FlatList, Image} from 'react-native'
import React,{useState} from 'react'
import { FontAwesome } from '@expo/vector-icons'; 
import {db} from "../../firebase/config"
import {collection, query, where, getDocs} from "firebase/firestore"
import avt from "../../assets/avt.jpeg"
import {useNavigation} from "@react-navigation/native"
const SearchScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState("")
    const [found, setFound] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [searchFriendName,setSearchFriendName] = useState([])

    const handlePressOutside = () => {
        // Tắt bàn phím khi chạm vào nơi khác ngoài ô nhập liệu
        Keyboard.dismiss();
    }

    const HandleSearch = async () => {
        handlePressOutside()
        if(search !== ''){
            setSearchFriendName([])
            const userRef = collection(db,'Users') // lấy bản user trong firebase
            const queryResult = query(userRef,where('username','>=',search.trim()),where('username','<=',search.trim()+'\uf8ff'))
            const querySnapshot = await getDocs(queryResult)
            setNotFound(true)
            if(!querySnapshot.empty){
                let friends = []
                querySnapshot.forEach((doc) => {
                const {profilePic,username} = doc.data()
                friends.push({profilePic,username})})
                setSearchFriendName(friends)
                setFound(true)
            }else{
                setFound(false)
            }
    }
}
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
    <View className="bg-gray-200 flex-1">
        <View className="flex-row items-center content-center mb-10 mx-4">
            <TextInput
            placeholder="Search"
            onChangeText={(value) => setSearch(value)}
            className = "tracking-widest bg-gray-100 rounded-lg w-[80%] h-14 text-base py-2 px-3 mx-4 mb-5 mt-8 text-sm mr-3"
            value={search} />
            <TouchableOpacity onPress={HandleSearch} className="bg-blue-300 w-14 h-14 py-2 justify-center items-center mt-3 rounded-xl">
            <FontAwesome name="search" size={30} color="black" />
        </TouchableOpacity>
        </View>

        {
        !notFound ? <View></View> : 
        found ? (
            <View>
                <FlatList
                className='mx-10'
                data = {searchFriendName}
                showsVerticalScrollIndicator = {false}
                keyExtrator = {(item) => item.username}
                renderItem = {({item}) => (
                    <TouchableOpacity onPress={() =>{navigation.replace("chat",{friendName:item.username, friendAvatar:item.profilePic})}}>
                        <View className='flex-row items-center space-x-4 bg-gray-100 px-4 py-4 rounded-lg'>
                            {item.profilePic !== undefined ? (
                                <Image source={{ uri : item.profilePic }} className="h-12 w-12 rounded-full"/>
                            ):(
                                <Image source={avt} className="h-12 w-12 rounded-full"/>
                            )}
                            <Text className="tracking-widest font-normal text-lg">
                                {item.username}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                />
            </View>
        ) : (
            <View className='items-center mr-3'>
                <Text className='tracking-widest font-normal text-lg text-red-600'>Not Found</Text>
            </View>
        )}  
    </View>
    </TouchableWithoutFeedback>
  )
}

export default SearchScreen