import React,{useState,useEffect} from "react";
import { View,KeyboardAvoidingView,Platform, Image, StyleSheet, Text,TextInput, TouchableOpacity,Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from '../services/api'

import logo from "../assets/logo.png";

export default function Login({navigation}) {

  const [email,setEmail]= useState('');
  const [techs,setTechs]= useState('');

  useEffect(()=>{
    AsyncStorage.getItem('user').then(user=>{
      if (user){
        navigation.navigate('List');
      }
    });
  },[])

async function handleSubmit(){
   
    if(email === "" || email === null){
      Alert.alert('Email invalido');
    }else{
      const response = await api.post('/sessions',{
        email
      });
      
      const{_id} = response.data;
      await AsyncStorage.setItem('user',_id);
      await AsyncStorage.setItem('techs',techs);
  
      navigation.navigate('List');
    }

   

}

return (
    <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding" style = {styles.container}>
      <Image source={logo}/>

      <View style={styles.form}>
        <Text style={styles.label}>SEU EMAIL *</Text>
        <TextInput
         style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
         />

        <Text style={styles.label}>TECNOLOGIAS *</Text>
        <TextInput
         style={styles.input}
          placeholder="Tecnologias de interesse"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setTechs}
         />

         <TouchableOpacity onPress={handleSubmit} style={styles.button}>

          <Text style={styles.buttonText}>Encontrar Spots</Text>
         </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  form:{
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop:30
  },
  label:{
    fontWeight: 'bold',
    color: '#444',
    marginBottom:8
  },
  input:{
    borderWidth:1,
    borderColor: "#ddd",
    paddingHorizontal:20,
    fontSize:16,
    color: "#444",
    height:44,
    marginBottom:20,
    borderRadius: 2
  },
  button:{
    height: 42,
    backgroundColor: '#f05a5b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  buttonText:{
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'

  }
  

});
