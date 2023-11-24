import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Image,Platform, FlatList} from 'react-native'
import React,{useState,useLayoutEffect, useContext, useRef, useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons'; 
import {useNavigation,useRoute} from "@react-navigation/native"
import avt from "../../assets/avt.jpeg"
import {AuthenticatedUserContext} from "../../context/AuthenticationContext"
import {db} from "../../firebase/config"
import MessageItem from "../Components/MessageItem"
import {collection, query, where, getDocs, addDoc,Timestamp,updateDoc,doc,onSnapshot} from "firebase/firestore"

const ChatScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {friendName,friendAvatar,friendEmail} = route.params;
    const [message, setMessage] = useState("")
    const {user} = useContext(AuthenticatedUserContext)
    const sender = user.email.split("@")[0]
    const [messages,setMessages] = useState([])
    const flatListRef = useRef(null)
    const [isListReadyInput,setIsListReadyInput] = useState(false)
    
    const userRef = collection(db,'Chats')
    const queryResult = query(userRef,where('chatters','==',`${sender}xx${friendName}`))
    const queryResult2 = query(userRef,where('chatters','==',`${friendName}xx${sender}`))

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View className="flex-row space-x-3 items-center">
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <Ionicons name="ios-chevron-back-outline" size={40} color="black" />
                    </TouchableOpacity>
                    {friendAvatar !== undefined ? (
                            <Image source={{ uri: friendAvatar }} className="h-10 w-10 rounded-full mr-3 mb-2"></Image>
                        ):(
                            <Image source={avt} className="h-12 w-12 rounded-full mr-3"></Image>
                    )}
                    <Text className='text-black font-bold tracking-widest text-xl'>{friendName}</Text>
                </View>
            )
        })
    },[])

    const handleSubmit = async () => {
        // console.log("message",message)
        const querySnapshot = await getDocs(queryResult);
        const querySnapshot2 = await getDocs(queryResult2);
        // console.log("test1", querySnapshot)
    
        if(!querySnapshot.empty || !querySnapshot2.empty){ // những người đã từng nhắn
            querySnapshot.forEach((document) => {
                updateDoc(doc(db,"Chats",document.id),{
                    conversation: [
                        ...document.data().conversation,
                        {
                            message: message,
                            timestamp:Timestamp.now(),
                            sender:sender
                        }
                    ]
                })
            })

            querySnapshot2.forEach((document) => {
                updateDoc(doc(db,"Chats",document.id),{
                    conversation: [
                        ...document.data().conversation,
                        {
                            message: message,
                            timestamp:Timestamp.now(),
                            sender:sender
                        }
                    ]
                })
            })

        }else{ 
            // console.log("1234")// người lần đầu nhắn
        await addDoc(collection(db,"Chats"),{
            chatters:`${sender}xx${friendName}`,
            conversation: [
                {
                    message: message,
                    timestamp: Timestamp.now(),
                    sender: sender
                }
            ]
        })}
        setMessage("")
    }

    useEffect(() => {
        const fetchMessages = async() => {
            const querySnapshot = await getDocs(queryResult)

            const querySnapshot2 = await getDocs(queryResult2)
            if(!querySnapshot.empty || !querySnapshot2.empty){
                let allMessages = querySnapshot.docs.map((doc) => 
                    doc.data().conversation
                )

                allMessages = allMessages.concat(querySnapshot2.docs.map((doc) => 
                    doc.data().conversation
                ))
                allMessages =  allMessages.sort((a,b) => a.timestamp?.seconds - b.timestamp?.seconds)
                setMessages(allMessages)
             }
        }
        const unsub1 = onSnapshot(queryResult,(snapshot) =>{
            const allMessages12 = snapshot.docs.map((doc) =>doc.data().conversation)
            setMessages(allMessages12)
        })

        const unsub2 = onSnapshot(queryResult2,(snapshot) =>{
            const allMessages23 = snapshot.docs.map((doc) =>doc.data().conversation)
            setMessages(allMessages23)
        })    
        fetchMessages()
        // return () => {
        //     unsub1();
        //     unsub2();
        // }

    },[])
    useEffect(() => {
        scrollToBottom()
    },[message])

//    console.log("message",messages[0])
    const scrollToBottom = () => {
    flatListRef?.current?.scrollToEnd({ animated: true });
    };

  return ( 
    <KeyboardAvoidingView
    style={{ flex: 1,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",}} behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -180}
    >
    <View>
      <View className="h-[90%]"> 
         {messages[0]  !== undefined && ( 
            <FlatList
                initialNumToRender={10}
                ref={flatListRef}
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
                data={messages[0]}
                renderItem={({ item }) => (
                     <MessageItem item= {item} sender = {sender} />
                  )}
                keyExtractor={item => item.timestamp}
            />
            
        )}
      </View>
      <View className="h-[10%] flex-row items-center mx-3 space-x-3 "> 
                   
                <TextInput 
                    className="bg-white rounded-xl p-2 flex-1 text-gray-700 h-12 py-3"
                    placeholder='type your message here ...'
                    multiline={true}
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity onPress={handleSubmit} >
                    <Ionicons name="ios-send" size={40} color="black" />
                </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default ChatScreen