var config = {
    apiKey: "AIzaSyC9h2PUE_MqHDbAei_AROxKAEFDsayeOMI",
    authDomain: "this-is-a-thomas-project.firebaseapp.com",
    databaseURL: "https://this-is-a-thomas-project.firebaseio.com",
    projectId: "this-is-a-thomas-project",
    storageBucket: "this-is-a-thomas-project.appspot.com",
    messagingSenderId: "811715918066"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  var trainRef = database.ref("/trains/");
  var trainName = "";
  var destination = "";
  var startTime = "";
  var frequency = "";
  var nextArrivalTime = "";
  var timeToNextArrival = 0;

function calculateTrainTime() {
    var firstTime = startTime;
    var trainFrequency = frequency;
    
    var convertedFirsttime = moment(firstTime, "HH:mm").subtract("1", "years")
    var currentTime = moment().format("HH:mm");

    var time = moment().diff(moment(convertedFirsttime), "minutes");
    console.log(convertedFirsttime);
    console.log(currentTime);
    console.log(time);

    timeToNextArrival = trainFrequency - (time % trainFrequency);
    console.log(timeToNextArrival);

    nextArrivalTime = moment().add(timeToNextArrival, "minutes").format("hh:mm A");
    // console.log("Next train arrives at " + moment(nextArrival).format("HH:mm A"));
}


  $(document).ready( () => {
    
    // calculateTrainTime();
    
    // Add new information to the database
    $("#trainSubmit").on("click", (event) => {
        event.preventDefault();

        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        startTime = $("#first-arrival-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        console.log(trainName);
        console.log(destination);
        console.log(startTime);
        console.log(frequency);

        // Add data to trains table
        trainRef.push({
            name: trainName,
            destination: destination,
            startTime: startTime,
            frequency: frequency
        });
    });

    // Add data from the databade to the screen.
    trainRef.on("child_added", (snapshot) => {
        console.log(snapshot);

        // Grab data and stash in global variables
        trainName = snapshot.val().name;
        destination = snapshot.val().destination;
        frequency = snapshot.val().frequency;
        startTime = snapshot.val().startTime;
        
        calculateTrainTime();

        // Create a new table row and add contents
        var newRow = $("<tr>");
        newRow.append("<td>" + snapshot.val().name + "</td>");
        newRow.append("<td>" + snapshot.val().destination + "</td>");
        newRow.append("<td>" + snapshot.val().frequency + "</td>");
        newRow.append("<td>" + nextArrivalTime + "</td>");
        newRow.append("<td>" + timeToNextArrival +"</td>");

        $("tbody").append(newRow);
    });
  })