import { View, Text, TouchableOpacity,Alert,Image } from 'react-native'
import React,{useContext,useEffect, useState} from 'react'
import {signOut} from "firebase/auth"
import {auth, db} from "../../firebase/config"
import {AuthenticatedUserContext} from "../../context/AuthenticationContext"
import {collection, query, where, getDocs,updateDoc, doc} from "firebase/firestore"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker';
import {ref,getStorage,uploadBytes, getDownloadURL} from "firebase/storage"
const ProfileScreen = () => {
  const storage = getStorage();
  const navigation = useNavigation();
  const [userName,setUserName] = useState('')
  const [image,setImage] = useState('')
  const [email,setEmail] = useState('')
  const [userImageUrl, setUserImageUrl] = useState(null);
  const {user, setUser,setUserAvtUrl} = useContext(AuthenticatedUserContext)
  const userRef = collection(db,'Users') // lấy bản user trong firebase
  const queryResult = query(userRef,where('email','==',user.email))
  const DocFinder = async (queryResult) =>{
    const querySnapshot = await getDocs(queryResult);
    querySnapshot.forEach((doc) => {
      if(userName === ''){
        const {username,email,profilePic} = doc.data()
        setUserName(username)
        setEmail(email)
        setImage(profilePic)
      }
    })
  }
  const logOut = () =>{
    signOut(auth).then(() =>{
      setUser(null)
      navigation.navigate("login")
    }).catch((error) =>{
      Alert.alert(error.message)
    })
  }
  useEffect(()=>{
    if(!user) return
    
    DocFinder(queryResult)
  },[])


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }else {
      Alert.alert('You did not select any image.');
    }
  };
  const uploadImage = async (image) =>{
    try{
      const reponsive = await fetch(image)
      const blob = await reponsive.blob()
      const fileName = image.substring(image.lastIndexOf("/"))
      const imageRef = ref(storage,`ProfilePictures/${fileName}`)
      uploadBytes(imageRef, blob).then(async() => {
        const downloadUrl = await getDownloadURL(imageRef)
        const querysnapshot = await getDocs(queryResult)
        querysnapshot.forEach(async(document) =>{
            await updateDoc(doc(db,'Users', document.id),{
              profilePic: downloadUrl
            }).then(() => {
              setUserImageUrl(downloadUrl)
              setUserAvtUrl(downloadUrl)
            })
        })

      })
    }catch (error){
      Alert.alert(error.message)
    }
  }
  return (
    <View>
      <View className="justify-center items-center my-10">
        <Text className="text-2xl font-medium tracking-widest">welcom,<Text className="text-[#d60e45] ">{userName}</Text></Text>
      </View>
      { image === undefined ?
      <TouchableOpacity  onPress={pickImage} className="bg-gray-400 items-center justify-center rounded-md mx-10 mb-10">
       {userImageUrl === null ? <MaterialCommunityIcons name="camera" size={50} color="white" />: <Image source={{ uri: userImageUrl }} className="h-40 w-full"></Image>}
      </TouchableOpacity> :
      <View className='justify-center items-center mb-10'>
      <Image source={{ uri: image ? image : null }} className="object-cover w-80 h-40 rounded-md"></Image>
      </View>
      }
      <View className="">
        <Text className="tracking-widest bg-gray-200 rounded-lg w-80 text-base py-3 px-3 mx-5 mb-5 text-blue-900 font-light">{userName}</Text>
        <Text className="tracking-widest bg-gray-200 rounded-lg w-80 text-base py-3 px-3 mx-5 mb-5 text-blue-900 font-light">{email}</Text>
      </View>
      <TouchableOpacity onPress={logOut} className="bg-[#fac25a] py-2 rounded-md mx-20 mt-5 mb-3">
        <Text className="text-center text-white font-semibold text-2xl">Log Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileScreen