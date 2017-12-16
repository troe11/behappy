  var config = {
    apiKey: "AIzaSyBpdGq5ONXfo854jcRj-4OwRWUYggFkRk4",
    authDomain: "be-happy-web-appy.firebaseapp.com",
    databaseURL: "https://be-happy-web-appy.firebaseio.com",
    projectId: "be-happy-web-appy",
    storageBucket: "be-happy-web-appy.appspot.com",
    messagingSenderId: "232740001079"
  };
  firebase.initializeApp(config);
var database = firebase.database();
var emotionCount = {
    Happiness: 0,
    Sadness: 0,
    Disgust: 0,
    Anger: 0,
    Fear: 0,
    Surprise: 0,
    Neutral: 0,
}

var emotions = ['Happiness', 'Sadness', 'Disgust', 'Anger', 'Fear', 'Surprise', 'Neutral'];
//the below function populates the Main Div with buttons corresponding to the emotions array
var populateEmotions = function() {
    var emoteButtonsDiv = $('<div>');
    for (var i = 0; i < emotions.length; i++) {
        var emotion = $('<button>').html(emotions[i]).attr('id', emotions[i]).addClass('emotion');
        emoteButtonsDiv.append(emotion);
    }
    $('#main').empty();
    $('#main').append(emoteButtonsDiv);
}
//runs when page loads
populateEmotions();

//when an emotion button is clicked, empty the Main Div, then use the choices function
//to populate with new buttons - main choices: gif, reddit, etc.
$(document).on('click', '.emotion', function() {
    $('#main').empty();
    choices();
        var thisEmote = $(this).attr('id');
    for (var i in emotionCount){
        if(i == thisEmote){
            emotionCount[i]++;
            console.log(emotionCount, moment().format('dddd H:mm'))
            database.ref().set({
                    emotionCount
            })
        }
    }
})

database.ref().on("value", function(snapshot) {
    console.log(snapshot.val(), moment().format('dddd H:mm'))
    emotionCount = snapshot.val().emotionCount
        }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    
    });


var choices = function() {
    var choiceDiv = $('<div>');
    var video = $('<button>').html('Video (n/a)').attr('id', 'video');
    var audio = $('<button>').html('Song (n/a)').attr('id', 'audio');
    var reddit = $('<button>').html('Reddit').attr('id', 'reddit');
    var pickUpLine = $('<button>').html('Pick Up Line (n/a)').attr('id', 'pickUp');
    var giphy = $('<button>').html('Gif').attr('id', 'gif');
    choiceDiv.append(audio, video, reddit, pickUpLine, giphy);
    $('#main').append(choiceDiv);
};

$(document).on('click', '#reddit', function() {
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
                        $('#main').append(text)}
                    
                })
                resartOrNewChoice();  
        })
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
    var random = $('<button data-gif = "random">').html('Random').attr('class', 'giphy');
    var kawaii = $('<button data-gif = "kawaii">').html('Kawaii').attr('class', 'giphy');
    typeDiv.append(cat, comedy, dog, random, kawaii);
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

        
        var image = '<img src= " ' + response.data[i].images.fixed_height.url +
            '" data-still=" ' + response.data[i].images.fixed_height_still.url +
            ' " data-animate=" ' + response.data[i].images.fixed_height.url + '" data-state="animate" class="movImage" style= "width:500px; height:500px">';

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
    resartOrNewChoice();
}
    
//adds two buttons to the bottom, giving user the choice to go back to main
//menu and choose new emotion, or select another choice
var resartOrNewChoice = function() {
    var newSelect = $('<div>').css('display','inline');
    var newChoice = $('<button>').html('New Choice').attr('id', 'newChoice');
    var resart = $('<button>').html('Change your Emotion?').attr('id', 'newEmotion');
    newSelect.append(newChoice, resart);
    $('#main').append(newSelect);
}

//runs choices if newChoice is clicked in resartOrNewChoice
$(document).on('click', '#newChoice', function() {
    $('#main').empty();
    choices();
})
//runs original emotion div populator
$(document).on('click', '#newEmotion', function() {
    $('#main').empty();
    populateEmotions();
})