var config = {
    apiKey: "AIzaSyDMWhhXETn_L7JClHW6hTAadpqnZg_Prww",
    authDomain: "newproj-735bf.firebaseapp.com",
    databaseURL: "https://newproj-735bf.firebaseio.com",
    projectId: "newproj-735bf",
    storageBucket: "newproj-735bf.appspot.com",
    messagingSenderId: "93086397648"
};
firebase.initializeApp(config);
var signedOn = false;
var database = firebase.database();

var choices = function() {
    var choiceDiv = $('<div>');
    var youTube = $('<button>').html('Video');
    var spotify = $('<button>').html('Song');
    choiceDiv.append(spotify);
    choiceDiv.append(youTube);
    $('#main').append(choiceDiv);
}

$('.emotion').on('click', function() {
    var user = firebase.auth().currentUser;
    var currentEmote = $(this).attr('id');
    var currentTime = moment().format('dddd HH:mm');
    if (signedOn) {
        console.log('Signed in');
        $('#main').empty();
        choices();
        database.ref('/users').child(user.uid).push({
            emotion: currentEmote,
            datetime: currentTime
        })
    } else { alert('You need to sign In or Up') }
    console.log(currentEmote, currentTime)


})

$('#signUp').on('click', function() {
    event.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

    console.log(email, password)
})

$('#signIn').on('click', function() {
    signedOn = true;
    event.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage)
    });

    console.log(email, password)
})

$('#signOut').on('click', function() {


    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });

    console.log(email, password)
})


firebase.auth().onAuthStateChanged(function(user) {
    console.log(user)
    if (user) {
        database.ref('/users').child(user.uid).once('value').then(function(snapshot) {
            //Look up documentation for once method

            $('#status').html('Signed In')

            userName = snapshot.val().name;
            userAge = snapshot.val().age;
            $('#userName').text(userName);
            $('#userAge').text(userAge);
            if (user != null) {
                user.providerData.forEach(function(profile) {
                    console.log(profile)
                    // console.log("Sign-in provider: " + profile.providerId);
                    // console.log("  Provider-specific UID: " + profile.uid);
                    // console.log("  Name: " + profile.displayName);
                    // console.log("  Email: " + profile.email);
                    // console.log("  Photo URL: " + profile.photoURL);
                });

            }
        })
    } else {
        console.log('none')
        $('#status').html('Signed Out')
    }
});

$('#create').on('click', function() {
    event.preventDefault();
    var user = firebase.auth().currentUser;
    if (user) {
        console.log('Signed in');
        database.ref('/users').child(user.uid).set({
            name: $('#name').val().trim(),
            age: $('#age').val().trim()
        })
    } else {
        console.log('Not signed in')
    }
})