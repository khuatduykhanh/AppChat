import { View, Text,TextInput,TouchableOpacity,TouchableWithoutFeedback, Keyboard,Alert } from 'react-native'
import React,{ useState } from 'react'
import {useNavigation} from "@react-navigation/native"
import {auth,db} from "../../firebase/config"
import {createUserWithEmailAndPassword} from "firebase/auth"
import {collection, addDoc } from 'firebase/firestore';

const SignupScreens = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handlePressOutside = () => {
        // Tắt bàn phím khi chạm vào nơi khác ngoài ô nhập liệu
        Keyboard.dismiss();
    }
    const register = () => {
        if(userName !== "" && password !== "" && confirmPassword !== ""){
            if(password !== confirmPassword) {
                Alert.alert("password does not match")
            }
            else{
                createUserWithEmailAndPassword(auth,userName,password).then(async(res) =>{
                    await addDoc(collection(db,"Users"),{
                        userId: res.user.uid,
                        email: res.user.email,
                        username: res.user.email.split("@")[0],
                    })
                })
            }
        }
    }
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
    <View className='mt-20'>
        <Text className="text-[#d60e45] text-3xl font-semibold text-center py-3 mt-3">Sign up</Text>
      <TextInput
        keyboardType='email-address'
        placeholder="Enter Email"
        onChangeText={(value) => setUserName(value)}
        className = "tracking-widest bg-gray-100 h-14 rounded-lg w-100 text-base py-2 px-3 mx-3 mb-5 mt-8 text-sm"
        value={userName}
      />
      <TextInput
        placeholder="Enter Password"
        onChangeText={(value) => setPassword(value)}
        className = "tracking-widest bg-gray-100 h-14 rounded-lg w-80 text-base py-2 px-1 mx-3 mb-5 mt-3"
        textContentType="password"
        secureTextEntry={true}
        autoCorrect={false}
        autoCapitalize="none"
        value={password}
      />
      <TextInput
        placeholder="Confirm Password"
        onChangeText={(value) => setConfirmPassword(value)}
        className = "tracking-widest bg-gray-100 h-14 rounded-lg w-80 text-base py-2 px-1 mx-3 mb-5 mt-3"
        textContentType="password"
        secureTextEntry={true}
        autoCorrect={false}
        autoCapitalize="none"
        value={confirmPassword}
      />
      <TouchableOpacity onPress={register} className="bg-[#fac25a] py-2 rounded-md mx-10 mt-5 mb-3">
        <Text className="text-center text-white font-semibold text-2xl">Register</Text>
      </TouchableOpacity>
      <View className="flex-row justify-center mt-5 space-x-2">
        <Text>Already have an account ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text className="text-[#d60e45]">Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
}

export default SignupScreens