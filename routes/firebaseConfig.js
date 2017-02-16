var firebase = require("firebase");

var config = {
		  apiKey: "AIzaSyDr59x4BllLBI3GueP-rrGTAGqCI-FpiX0",
		  authDomain: "insighters-67d01.firebaseapp.com",
		  databaseURL: "https://insighters-67d01.firebaseio.com/",
		  storageBucket: "insighters-67d01.appspot.com",
		};
firebase.initializeApp(config);

exports.firebase = firebase;