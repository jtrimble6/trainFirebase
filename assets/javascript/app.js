var config = {
    apiKey: "AIzaSyC0CRmvpwZ7w08To02KJxCiFWFxS5hnCLw",
    authDomain: "trainschedule-8c206.firebaseapp.com",
    databaseURL: "https://trainschedule-8c206.firebaseio.com",
    projectId: "trainschedule-8c206",
    storageBucket: "",
    messagingSenderId: "258363007117"
  };
    firebase.initializeApp(config);

    var database = firebase.database();

    $('body').on('click', '#addTrain', function(){
        event.preventDefault();

        // GRAB ENTRIES FROM INPUT FIELD AND PUSH THEM TO FIREBASE
        var trainName = $('#trainName').val().trim();
        var trainDestination = $('#trainDestination').val().trim();
        var startTime = $('#startTime').val().trim();
        var trainFrequency = $('#trainFrequency').val().trim();
        console.log(trainName);
        console.log(trainDestination);
        console.log(startTime);
        console.log(trainFrequency);

        var newTrain = {
            name: trainName,
            destination: trainDestination,
            time: startTime,
            frequency: trainFrequency
        }

        database.ref().push(newTrain);

        //CLEAR ENTRY FIELDS AFTER SUBMIT
        $('#trainName').val("");
        $('#trainDestination').val("");
        $('#startTime').val("");
        $('#trainFrequency').val("");

    });

    //CREATING EVENT EVERY TIME NEW TRAIN IS ADDED TO ADD TO PAGE
    database.ref().on("child_added", function(childSnap){
        console.log(childSnap.val());

        //MATH TO FIND NEXT ARRIVAL
        var currentTime = moment().format("HH:mm");
        var startTime = childSnap.val().time;
        var convertedTime = moment(startTime, "HH:mm").subtract(1, "years");
        var trainFrequency = childSnap.val().frequency; 
        
        console.log("Start time: " + startTime);
        console.log("Converted start time: " + convertedTime);
        console.log("Current time: " + currentTime);
        
        var diffTime = moment().diff(moment(convertedTime), "minutes");
        console.log("Difference in time: " + diffTime);

        var tRemainder = diffTime % trainFrequency;
        console.log("Remainder: " + tRemainder);

        var tMinutesTillTrain = trainFrequency - tRemainder;
        console.log("Minutes till train: " + tMinutesTillTrain);

        var trainArrival = moment().add(tMinutesTillTrain, "minutes");
        var trainArrivalConverted = trainArrival.format("HH:mm");
        console.log("Train arrival time: " + trainArrival);
        console.log("Train arrival time converted: " + trainArrivalConverted);

        var trainAway = moment().diff(moment(trainArrival), "minutes");
        var trainAwayConverted = Math.abs(trainAway);
        console.log("Train minutes away: " + trainAway);
        console.log("Train minutes away converted: " + trainAwayConverted); 

        //CREATE VARIABLES FOR INFO
        var trainName = childSnap.val().name;
        var trainDestination = childSnap.val().destination;

        console.log("");
        console.log("Name: " + trainName);
        console.log("Destination: " + trainDestination);
        console.log("Start time: " + startTime);
        console.log("Frequency: " + trainFrequency);

        //ADD TRAIN DATA TO TABLE
        $('#activeTrains').append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + trainArrivalConverted + "</td><td>" + trainAwayConverted + "</td></tr>");

        //CLEAR ENTRY FIELDS AFTER SUBMIT
        $('#trainName').val("");
        $('#trainDestination').val("");
        $('#startTime').val("");
        $('#trainFrequency').val("");
  })