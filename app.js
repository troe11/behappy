$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBpdGq5ONXfo854jcRj-4OwRWUYggFkRk4",
    authDomain: "be-happy-web-appy.firebaseapp.com",
    databaseURL: "https://be-happy-web-appy.firebaseio.com",
    projectId: "be-happy-web-appy",
    storageBucket: "be-happy-web-appy.appspot.com",
    messagingSenderId: "232740001079"
  };
  firebase.initializeApp(config);
  console.log(config)


})