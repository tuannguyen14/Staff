import React from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import OrderedList from "./Screens/OrderedList";

export const MainScreen = StackNavigator({
  OrderedListScreen: {
    screen: OrderedList
  }
});
