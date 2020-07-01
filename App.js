import React, { Component } from 'react';
import homescreen from './screens/homescreen';
import addnewcontact from './screens/addnewcontact';
import editcontact from './screens/editcontact';
import viewcontact from './screens/viewcontact';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';

const Stack= createStackNavigator();
export default class App extends Component {
  
  render(){
  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={homescreen} options={{ title: 'My Home',headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          } }}/>
          <Stack.Screen name="Add" component={addnewcontact} options={{ title: 'Add Contact',headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          } }}/>
          <Stack.Screen name="Edit" component={editcontact} options={{ title: 'Edit Contact', headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }}}/>
          <Stack.Screen name="View" component={viewcontact} options={{ title: 'View Contact', headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          }}}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}
}
var firebaseConfig = {
  apiKey: "AIzaSyDX3km5jxUstCxO9P5BpAlJnsefnMmKb4M",
  authDomain: "react-native-884f7.firebaseapp.com",
  databaseURL: "https://react-native-884f7.firebaseio.com",
  projectId: "react-native-884f7",
  storageBucket: "react-native-884f7.appspot.com",
  messagingSenderId: "288312978026",
  appId: "1:288312978026:web:c6bfdc044470e6418d3813",
  measurementId: "G-FCT2MP2167"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


