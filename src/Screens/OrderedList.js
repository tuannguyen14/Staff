//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput
} from "react-native";

import { firebaseApp } from "../api/Firebase";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "../components/Responsive.js";

import Dialog, { Alert, Confirm, Prompt } from "react-native-modal-dialog";

import Toast, { DURATION } from "react-native-easy-toast";

console.disableYellowBox = true;

// create a component
class OrderedList extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitleStyle: {
      justifyContent: "center",
      alignItems: "center",
      color: "#FFFFFF",
      marginLeft: "44%"
    },
    headerTintColor: "#FFFFFF",
    title: "Shop",
    headerStyle: {
      backgroundColor: "#F74F4F"
    }
  });
  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref();
    this.state = {
      listItems: [],
      numberOfItem: 1
    };
  }

  componentWillMount() {
    let arrayTempItem = [];
    this.itemRef.child("Ordered").on("child_added", snapshot => {
      arrayTempItem.push({
        name: snapshot.key,
        image: snapshot.val().Image,
        numberOfItem: snapshot.val().NumberOfItem,
        price: snapshot.val().Price,
        date: snapshot.val().Date
      });
      this.setState({
        listItems: arrayTempItem
      });
    });
  }

  done(item, index) {
    if (item.numberOfItem >= this.state.numberOfItem) {
      this.itemRef
        .child("Ordered")
        .child(item.name)
        .set({
          Image: item.image,
          NumberOfItem: item.numberOfItem - this.state.numberOfItem,
          Date: new Date().getTime(),
          Price: item.price
        });
      const newPostKey = firebaseApp
        .database()
        .ref()
        .push().key;
      let dateCurrentItem;
      this.itemRef
        .child("Ordered")
        .child(item.name)
        .once("value", snapshot => {
          dateCurrentItem = this.formatDate(new Date(snapshot.val().Date));
        });
      this.itemRef
        .child("Income")
        .child(dateCurrentItem)
        .child(newPostKey)
        .set({
          Name: item.name,
          NumberOfItem: this.state.numberOfItem,
          Price: parseInt(item.price) * parseInt(this.state.numberOfItem),
          DateTime: item.date
        });
      if (item.numberOfItem - this.state.numberOfItem == 0) {
        this.itemRef
          .child("Ordered")
          .child(item.name)
          .remove();
        this.setState({
          listItems: this.deleteByValue(this.state.listItems, index)
        });
      } else {
        this.subtractItem(
          this.state.listItems,
          index,
          item.numberOfItem,
          this.state.numberOfItem
        );
      }
      this.refs.toast.show("Thành công");
    } else {
      this.refs.toast.show(
        "Số lượng đã làm xong không thể lớn hơn số lượng hiện tại"
      );
    }
  }

  formatDate(date) {
    let day = date.getDate();
    let monthIndex = date.getMonth() + 1;
    if (monthIndex < 10) {
      monthIndex = "" + "0" + monthIndex;
    }
    let year = date.getFullYear();

    return day + "-" + monthIndex + "-" + year;
  }

  deleteByValue(array, index) {
    delete array[index];
    return array;
  }

  subtractItem(array, index, database, current) {
    temp = array;
    temp[index].numberOfItem = database - current;
    this.setState({
      listItems: temp
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.listItems.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                this.refs.dialog.alert(undefined, {
                  title: "Số lượng đã làm xong",
                  titleStyle: { color: "#03A9F4" },
                  children: (
                    <View>
                      <TextInput
                        onChangeText={numberOfItem =>
                          this.setState({ numberOfItem })
                        }
                      />
                    </View>
                  ),
                  posText: "Đồng ý",
                  buttonStyle: { color: "#03A9F4" },
                  onPosClick: () => {
                    this.refs.dialog.hide();
                    this.done(item, index, this.state.numberOfItem);
                  }
                });
              }}
            >
              <View style={styles.item}>
                <ImageBackground
                  source={{ uri: item.image }}
                  style={{
                    width: responsiveWidth(33),
                    height: responsiveWidth(50)
                  }}
                />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.numberOfItem}>{item.numberOfItem} cái</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {Dialog.inject()}
        <Alert ref="alert" message="message" />
        <Toast ref="toast" />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    margin: 2,
    backgroundColor: "#F8DCB5",
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center"
  }
});

//make this component available to the app
export default OrderedList;
