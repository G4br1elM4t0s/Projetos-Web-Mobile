import{View, Text, Image,StyleSheet, SafeAreaView} from 'react-native';

import React,{useState, useEffect} from 'react';

import AsyncStorage from "@react-native-async-storage/async-storage";

import logo from '../assets/logo.png'

export default function List(){
    const [techs,setTechs] = useState([]);

    useEffect(() =>{
        AsyncStorage.getItem('techs').then(storegeTechs =>{
            const techsArray = storegeTechs.split(',').map(tech => tech.trim());
            
            setTechs(techsArray);
        })
    },[])
    return (
    <SafeAreaView>
        <Image source={logo}/>
        <Text>{techs}</Text>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },

    logo: {
        height:32
    }
})