import { View, Text,TouchableOpacity,Image, ActivityIndicator, FlatList } from 'react-native'
import React,{useLayoutEffect,useContext,useEffect,useState} from 'react'
import {collection, query, where, getDocs, onSnapshot} from "firebase/firestore"
import {AuthenticatedUserContext} from "../../context/AuthenticationContext"
import {auth,db} from "../../firebase/config"
import {useNavigation} from "@react-navigation/native"
import { Ionicons } from '@expo/vector-icons';
import avt from "../../assets/avt.jpeg"
import ChatItem from "../Components/ChatItem"
import {sortLastMessage,combinedData} from "../Utils/index"
const HomeScreen = () => {
    const userRef = collection(db,'Users') // lấy bản user trong firebase
    const chatRef = collection(db,'Chats')
    const {user,userAvtUrl,setUserAvtUrl} = useContext(AuthenticatedUserContext)
    const navigation = useNavigation();
    const username = user.email.split("@")[0]
    const [friends,setFriends] = useState([])
    const [friendAvatar,setFriendAvatar] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [lastMessage,setLastMessage] = useState([])
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => {navigation.navigate("profile")}} >
                    <Image source={{uri: userAvtUrl ? userAvtUrl : null }} className="h-10 w-10 rounded-3xl"></Image>
                </TouchableOpacity>
            ),
        })

    },[userAvtUrl])
    const DocFinder = async (queryResult) =>{
        const querySnapshot = await getDocs(queryResult);
        querySnapshot.forEach((doc) => {
            const {profilePic} = doc.data()
            setUserAvtUrl(profilePic)
        })
      }
    useEffect(()=>{
        if(!user) return
        
        const queryResult = query(userRef,where('email','==',user.email))
        DocFinder(queryResult)
      },[])
    
    useEffect(() => {
        if(!user) return
        const fetchLoggedUserChats = async () => {
            setIsLoading(true)
            const queryResult = query(chatRef,where('chatters','>=',`${username}`),where('chatters','<=',`${username}`+'\uf8ff'))
            const queryResult2 = query(chatRef,where('chatters','<=',`xx${username}`))
        
        let friendsArray = []
        const unsubscribe = onSnapshot(queryResult,(querySnapshot) => {
            setIsLoading(false)
            querySnapshot.forEach((doc) => {
                if(doc.data().chatters.includes(username)){
                    const chats = doc.data().chatters
                    const friends = chats.replace(username,'').replace("xx",'')
                    friendsArray.push(friends)
                    friendsArray = [...new Set(friendsArray)] // Loại bỏ các phần tử trùng lặp trong mảng friendsArray
                    setFriends(friendsArray)
                }
            })
        })
        const unsubscribe2 = onSnapshot(queryResult2,(querySnapshot) => {
            setIsLoading(false)
            querySnapshot.forEach((doc) => {
                if(doc.data().chatters.includes(username)){
                    const chats = doc.data().chatters
                    const friends = chats.replace(username,'').replace("xx",'')
                    friendsArray.push(friends)
                    friendsArray = [...new Set(friendsArray)]
                    setFriends(friendsArray)
                }
            })
        })
        return () => {
            unsubscribe()
            unsubscribe2
        }
    }
    fetchLoggedUserChats()
    },[])
    // console.log("friends",friends)

    useEffect(() => {
        if(!user) return
        let avatarsArray = []
        let latestMessage = []

        const unsubscribe = friends.map((friend) =>{
            const queryResult = query(userRef,where('username', '==', friend))
            const unsubFriend = onSnapshot(queryResult,(querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const {profilePic,email} = doc.data()
                    avatarsArray.push({name:friend, avatar:profilePic, email: email})
                    setFriendAvatar([...avatarsArray])
                })
            })
            const queryResult2 = query(chatRef,where('chatters', '==', `${username}xx${friend}`))
            const queryResult3 = query(chatRef,where('chatters', '==', `${friend}xx${username}`))

            const unsubChat = onSnapshot(queryResult2,(querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const conversation = doc.data().conversation
                    let lastMessage = []
                    if(conversation && conversation.length > 0){
                        lastMessage = [conversation[conversation.length - 1]]
                    }
                    latestMessage.push({
                        chatters: doc.data().chatters,
                        message: lastMessage
                    })
                    setLastMessage([...latestMessage])
                })
               
                
            })
            const unsubChat2 = onSnapshot(queryResult3,(querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const conversation = doc.data().conversation
                    let lastMessage = []
                    if(conversation && conversation.length > 0){
                        lastMessage = [conversation[conversation.length - 1]]
                    }
                    latestMessage.push({
                        chatters: doc.data().chatters,
                        message: lastMessage
                    })
                    setLastMessage([...latestMessage])
                })
                
                
            })
            return () => {
                unsubFriend()
                unsubChat()
                unsubChat2()
            }
        })
       
        
        return () => unsubscribe.forEach((unsub) => unsub())
    },[friends])
    // console.log("last messgae",JSON.stringify(lastMessage))

    const sortedLastMessage = lastMessage.sort(sortLastMessage)
    //  console.log("sort last messgae",JSON.stringify(sortedLastMessage))
    const combData = combinedData(friendAvatar,sortedLastMessage) 
    // console.log("combdata", combData)
  return (
    <>
    {isLoading ? (
        <View className="items-center justify-center h-full">
            <ActivityIndicator size='large' color="#d44a00"></ActivityIndicator>
        </View>
    ) : (
        <FlatList
            data={combData}
            renderItem = {({item}) => (
                <ChatItem navigation= {navigation} friend={item}/>
            )}
        />
    )}
    <View className='flex-1 relative'>
        <View className='flex-row-reverse absolute bottom-20 right-8'>  
            <TouchableOpacity onPress={() => {navigation.navigate("search")}} className="bg-blue-300 w-20 px-4 py-3 rounded-full">
                <Ionicons name="ios-chatbox-ellipses" size={50} color="black" />
            </TouchableOpacity>
        </View>
    </View>
    </>
  )
}

export default HomeScreen