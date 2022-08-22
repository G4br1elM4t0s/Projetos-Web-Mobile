import {
  Alert,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketio from "socket.io-client";

import logo from "../assets/logo.png";

import SpotList from "../components/SpotList";

export default function List() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then(user_id => {
      const socket = socketio('http://192.168.15.49:3333', {
        query: { user_id }
      })
      socket.on('booking_response', booking => {
        Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} ${(booking.approved === true) ? "APROVADO" : "REPROVADO"}`);
      })
    })
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("techs").then((storegeTechs) => {
      const techsArray = storegeTechs.split(",").map((tech) => tech.trim());

      setTechs(techsArray);
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <ScrollView>
        {techs.map((tech) => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 45,
  },
});
