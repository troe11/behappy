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
    var pickUpLine = $('<button>').html('Bad Tinder Pickup Lines').attr('id', 'tinder');
    var giphy = $('<button>').html('Gif').attr('id', 'gif');
    choiceDiv.append(audio, video, reddit, pickUpLine, giphy);
    $('#main').append(choiceDiv);
    $('#reddit').css("color", "#b71c1c");
    $('#video').css("color", "#0091ea");
    $('#audio').css("color", "#64ffda");
    $('#tinder').css("color", "#e91e63");
    $('#gif').css("color", "#ffc400");
};

$(document).on('click', '#reddit', function() {
    console.log('here')
    $('#main').empty();
    $.getJSON(
        "https://www.reddit.com/r/GetMotivated/top/.json?count=25&after=t3_10omtd/",
        function foo(data) {
            var text = [];
            console.log(data)
            $.each(
                data.data.children.slice(0, 200),
                function(i, post) {
                    if (post.data.title.includes("[Text]")) {
                        text.push(post.data.title.replace('[Text]', ''))

                    }
                })
            var randText = Math.floor(Math.random() * text.length);
            var textDiv = $('<div>')
                .html(text[randText])
                .addClass('redditText');
            $('#main').append(textDiv);
        })
    setTimeout(function() {
        resartOrNewChoice();
    }, 1000)
})

$(document).on('click', '#tinder', function() {
    $('#main').empty();
    $.getJSON(
        "http://www.reddit.com/r/tinder.json?jsonp=?",
        function foo(data) {
            var images = [];
            $.each(
                data.data.children.slice(0, 200),
                function(i, post) {
                    if (post.data.domain.includes("i.redd.it")) {
                        images.push(post.data.url);
                    }
                })
            var randImg = Math.floor(Math.random() * images.length);
            var image = $('<div>').html('<img src=' + images[randImg] + '>').addClass('center');
            $('#main').append(image);
        })
    setTimeout(function() {
        resartOrNewChoice();
    }, 1000)
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
    $('.giphy').css("color", "#ffc400");
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

$('.emotion').on('click', function() {
        $('#main').empty();
        choices();
})

var resartOrNewChoice = function() {
    var newSelect = $('<div>').css('display','inline');
    var newChoice = $('<button>').html('New Choice').attr('id', 'newChoice');
    var resart = $('<button>').html('Change your Emotion?').attr('id', 'newEmotion');
    var StatsBtn = $('<button>').html('Global Stats').attr('id', 'Stats');
    newSelect.append(newChoice, resart, StatsBtn);
    $('#main').append(newSelect);
    $('#newChoice').css("color", "#9575cd");
    $('#newEmotion').css("color", "#ffecb3");
    $('#Stats').css("color", "#cfd8dc");
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

$(document).on('click', '#Stats', function() {
    $('#main').empty();
    getStats();
})
var getStats = function() {
    database.ref().on('value', function(snapshot) {
        emotionCount = snapshot.val().emotionCount
    })
    $('#main').empty();
    var total = 0;
    for (var i in emotionCount) {
        total += emotionCount[i];
    }
    for (var i in emotionCount) {
        console.log(total);
        var emoteDiv = $('<div>').addClass('stats');
        var emoteName = emoteDiv.html(i + ': ' + Math.floor(emotionCount[i] / total * 100) + '%<hr>');
        $('#main').append(emoteDiv);
    }

    
    console.log('running')
    resartOrNewChoice();
}