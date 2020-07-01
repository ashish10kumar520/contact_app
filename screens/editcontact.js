import React, { Component } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";

//TODO: Add UUID

import { v4 as uuidv4 } from 'uuid';
import * as ImagePicker from 'expo-image-picker';

import { Form, Item, Input, Label, Button } from "native-base";



//TODO: add firebase
import * as firebase from 'firebase';

export default class EditContact extends Component {
  

  constructor(props) {
    super(props);
    // set state
    this.state = {
      fname: "",
      lname: "",
      phone: "",
      email: "",
      address: "",
      image: "empty",
      imageDownloadUrl: "empty",
      isUploading: false,
      isLoading: true,
      key: ""
    };
  }

  componentDidMount() {
    var key = this.props.route.params.key;
    this.getContact(key);
  }
  //TODO: getContact  method
  getContact = async key => {
    let self = this;
    let contactRef =firebase
    .database()
    .ref()
    .child(key);

     await contactRef.on("value", dataSnapshot => {
        if (dataSnapshot.val()) {
            contactValue = dataSnapshot.val();
            self.setState({
                fname: contactValue.fname,
                lname: contactValue.lname,
                phone: contactValue.phone,
                email: contactValue.email,
                address: contactValue.address,
                imageUrl: contactValue.imageUrl,
                key: key,
                isLoading: false
            });
        }
    })
  };

  //TODO: update contact method
  updateContact = async key => {
    if(
        this.state.fname !== "" &&
        this.state.lname !== "" &&
        this.state.phone !== "" &&
        this.state.email !== "" &&
        this.state.address !== ""
    ){
        this.setState({isUploading: true})
        const dbReference =firebase.database().ref();
        const storageRef =firebase.storage().ref();

        if(this.state.image !== "empty"){
            const downloadUrl =await this.uploadImageAsync(
                this.state.image,storageRef
            );
            this.setState({imageDownloadUrl:downloadUrl});
        }
        var contact ={
            fname: this.state.fname,
            lname:this.state.lname,
            phone:this.state.phone,
            email:this.state.email,
            address:this.state.address,
            imageDownloadUrl:this.state.imageDownloadUrl
        }
        await dbReference.child(key).set(contact, error =>{
            if(!error){
                return this.props.navigation.goBack();
            }
        })
    }
  };

  //TODO: pick image from gallery
  pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync(
          {
              quality:0.2,
              base64:true,
              allowsEditing:true,
              aspect:[1,1]
          }
      );
      if(!result.cancelled){
          this.setState({image:result.uri});
      }
  };

  //TODO: upload to firebase
  uploadImageAsync = async(uri, storageRef) => {
      const parts= uri.split(".");
      const fileExtension = parts[parts.length -1];

      //creating a blob
      const blob = await new Promise((resolve,reject) =>{
        const xhr =new XMLHttpRequest();
        xhr.onload = function(){
            resolve(xhr.response)
      };
      xhr.onerror = function(e){
          console.log(e)
          reject(new TypeError("NetWork request failed"))
      };
      xhr.responseType="blob";
      xhr.open("GET",uri,true);
      xhr.send(null);
    });
      //send to firebase
      const ref =storageRef
        .child("ContactImages")
        .child(uuidv4()+"."+fileExtension);
      const snapshot =await ref.put(blob)

      //close the blob
      blob.close();
      return await snapshot.ref.getDownloadURL();
    
  };

  // render method
  render() {
    if (this.state.isUploading) {
      return (
        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#B83227" />
          <Text style={{ textAlign: "center" }}>
            Contact Updating please wait..
          </Text>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView
         
        style={{ flex: 1 }}
        behavior="padding"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            // dismiss the keyboard if touch any other area then input
            Keyboard.dismiss();
          }}
        >
          <ScrollView style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.pickImage();
              }}
            >
              <Image
                source={
                  this.state.image === "empty"
                    ? require("../assets/person.jpg")
                    : {
                        uri: this.state.image
                      }
                }
                style={styles.imagePicker}
              />
            </TouchableOpacity>
            <Form>
              <Item style={styles.inputItem} floatingLabel>
                <Label style={styles.color}>First Name</Label>
                <Input style={{ color: "#fff" }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={fname => this.setState({ fname })}
                  value={
                    // set current contact value to input box
                    this.state.fname
                  }
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label style={styles.color}>Last Name</Label>
                <Input style={{ color: "#fff" }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={lname => this.setState({ lname })}
                  value={this.state.lname}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label style={styles.color}>Phone</Label>
                <Input style={{ color: "#fff" }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  onChangeText={phone => this.setState({ phone })}
                  value={this.state.phone}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label style={styles.color}>Email</Label>
                <Input style={{ color: "#fff" }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label style={styles.color}>Address</Label>
                <Input style={{ color: "#fff" }}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={address => this.setState({ address })}
                  value={this.state.address}
                />
              </Item>
            </Form>

            <Button
              style={styles.button}
              full
              rounded
              onPress={() => {
                this.updateContact(this.state.key);
              }}
            >
              <Text style={styles.buttonText}>Update</Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4C4B4B",
    margin: 0
  },
  inputItem: {
    margin: 10
  },
  imagePicker: {
    justifyContent: "center",
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: "#c1c1c1",
    borderWidth: 2
  },
  button: {
    backgroundColor: "#f4511e",
    marginTop: 40
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },color:{
    color:"#fff"
  }
});
