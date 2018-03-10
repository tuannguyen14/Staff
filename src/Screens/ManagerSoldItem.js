//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { firebaseApp } from "../api/Firebase";

// create a component
class ManagerSoldItem extends Component {
  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref();
    this.state = {
      listItems: {}
    };
  }

  componentWillMount() {
    this.itemRef.child("Income").on("child_added", snapshot => {
      for (let i in snapshot.val()) {
        let arrayTempItem = [];
        arrayTempItem.push({
          name: snapshot.val()[i].Name,
          numberOfItem: snapshot.val()[i].NumbersOfItem,
          price: snapshot.val()[i].Price,
          date: snapshot.val()[i].DateTime
        });
        this.addItem(
          this.formatDate(new Date(snapshot.val()[i].DateTime)),
          this.state.listItems,
          arrayTempItem
        );
      }
    });
  }

  addItem(date, array, item) {
    let temp = array;
    let tempArray = [];
    if (this.isContain(array, date, item) == true) {
      tempArray.push(item);
      tempArray.push(this.state.listItems[date]);
      temp[date] = tempArray;
    } else {
      temp[date] = item;
    }
    this.setState({
      listItems: temp
    });
  }

  isContain(array, date, item) {
    for (let i in array) {
      a = i + "";
      b = date + "";
      if (a.trim() == b.trim()) {
        return true;
      }
    }
    return false;
  }

  formatDate(date) {
    let day = date.getDate();
    let monthIndex = date.getMonth() + 1;
    let year = date.getFullYear();

    return day + "-" + monthIndex + "-" + year;
  }

  formatDateNames(date) {
    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  }

  render() {
    let sectionData = [];
    for (let i in this.state.listItems) {
      sectionData.push({
        date: i,
        data: this.state.listItems[i]
      });
    }
    console.log(sectionData);
    return (
      <View style={styles.container}>
        <FlatList
          data={sectionData}
          renderItem={({ item }) => (
            <View>
              <Text>{item.data.price}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

//make this component available to the app
export default ManagerSoldItem;
