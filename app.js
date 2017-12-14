  var config = {
    apiKey: "AIzaSyBpdGq5ONXfo854jcRj-4OwRWUYggFkRk4",
    authDomain: "be-happy-web-appy.firebaseapp.com",
    databaseURL: "https://be-happy-web-appy.firebaseio.com",
    projectId: "be-happy-web-appy",
    storageBucket: "be-happy-web-appy.appspot.com",
    messagingSenderId: "232740001079"
  };
  firebase.initializeApp(config);
var signedOn = true;
var database = firebase.database();

var choices = function() {
    var choiceDiv = $('<div>');
    var video = $('<button>').html('Video').attr('id', 'video');
    var audio = $('<button>').html('Song').attr('id', 'audio');
    var reddit = $('<button>').html('Reddit').attr('id', 'reddit');
    var pickUpLine = $('<button>').html('Pick Up Line').attr('id', 'pickUp');
    var giphy = $('<button>').html('Gif').attr('id', 'gif');
    choiceDiv.append(audio, video, reddit, pickUpLine, giphy);
    $('#main').append(choiceDiv);
};

$(document).on('click','#reddit', function() {
    console.log('here')
    $('#main').empty();
    $.getJSON(
        "http://www.reddit.com/r/getMotivated.json?jsonp=?",
        function foo(data) {
            console.log(data)
            $.each(
                data.data.children.slice(0, 200),
                function(i, post) {
                    if (post.data.title.includes("[Text]")) {
                        console.log(i, post.data.title);
                        var text = $('<div>').html(post.data.title.replace('[Text]', ''));
                        $('#main').append(text)

                    }
                }
            )
        }
    )

})

$(document).on('click','#gif', function() {
     $('#main').empty();
        types();
})

var types = function() {
    var typeDiv = $('<div>');
    var cat = $('<button data-gif = "cat">').html('Cat').attr('class', 'giphy');
    var comedy = $('<button data-gif = "comedy">').html('Comedy').attr('class', 'giphy');
    var dog = $('<button data-gif = "dog">').html('Dog').attr('class', 'giphy');
    // var  = $('<button>').html('').attr('class', 'giphy');
    // var  = $('<button>').html('').attr('class', 'giphy');
    typeDiv.append(cat, comedy, dog);
    $('#main').append(typeDiv);
};

$(document).on('click', '.giphy', function(){
    $('#main').empty();
    var gifName = $(this).attr("data-gif")
    console.log(gifName)
    $.ajax({
        url: 'https://api.giphy.com/v1/gifs/search?q= ' + gifName + ' &api_key=dc6zaTOxFJmzC&limit=60',
        type: 'GET',
    })
    .done(function(response) {
        displayGif(response);
    })
})



function displayGif(response) {
    $('#main').empty();
   var i = Math.floor((Math.random() * 60))

        
        var image = '<img src= " ' + response.data[i].images.fixed_height_still.url +
            '" data-still=" ' + response.data[i].images.fixed_height_still.url +
            ' " data-animate=" ' + response.data[i].images.fixed_height.url + '" data-state="still" class="movImage" style= "width:500px; height:500px">';

        image = '<div class = "center">' + image + "</div>";
        $('#main').append(image);
    

    $('.movImage').on('click', function() {
        var state = $(this).attr('data-state');
        if (state == 'still') {
            $(this).attr('src', $(this).attr("data-animate"));
            $(this).attr('data-state', 'animate');
        } else {
            $(this).attr('src', $(this).attr("data-still"));
            $(this).attr('data-state', 'still');
        }

    });
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