import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCF7LO-YD93__wLlpPkrGudtn9tOGU-juY",
  authDomain: "web-management-88bec.firebaseapp.com",
  databaseURL: "https://web-management-88bec.firebaseio.com",
  projectId: "web-management-88bec",
  storageBucket: "web-management-88bec.appspot.com",
  messagingSenderId: "1092747480578"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);