
// global variables
var numQuestions = 5; // number of questions in a round
var correctAnswers = 0; // counter for number of correct answers
var wrongAnswers = 0; // counter for number of wrong answers
var noAnswers = 0; // counter for number times no answer was selected before time ran out
var answerSubmitted = false; // flag to prevent selection of an answer after one has been selected or if time ran out
var questionCount = 0; // counter for number of questions presented
var numSeconds = 15; // number of seconds for each question
var timeBetween = 7; // number of seconds waiting for new question
var gameTriviaCards = []; // array of all questions and answers
var gameTriviaCardIndexes = []; // array of the cards (for randomizing question order)
var currentTriviaCard = []; // current trivia card in play
var timerIsStarted = false; // flag for if time is started (true) or stopped (false)
var timerId = null // the timer for setInterval
var timerMilliSeconds = 0; // the number of milliseconds on the timer
var debugFlag = false;  // turns on/off console.log debugging

function timerStart() {
    if (!timerIsStarted) {
        // note that setInterval is in the scope of the window object
        timerId = setInterval(timerCount, 100); // run "timerCount" every tenth of a second
        timerIsStarted = true; // flag for time in action
    }
}

function timerStop() {
    clearInterval(timerId); // dismiss the timer
    timerIsStarted = false; // re-set flag to indicate time is idle
    timerUpdate(); // update timer elements on browser
}

function timeFormat(millisec) {
    //  formats time into seconds and convert it to minutes and seconds (mm:ss), seconds (ss) or tenths of seconds (ss.s).
    var minutes = Math.floor(millisec / 60000);
    var seconds = Math.floor((millisec - (minutes * 60000)) / 1000);
    var tenths = Math.floor((millisec - (minutes * 60000) - (seconds * 1000)) / 100);

    if ((seconds < 2) && (minutes === 0)) {
        tenths = "." + tenths;
    } else {
        tenths = "";
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (minutes === 0) {
        minutes = "";
    } else if (minutes < 10) {
        minutes = "0" + minutes + ":";
    } else {
        minutes = minutes + ":";
    }
    return minutes + seconds + tenths;
}

function timerUpdate() {
    // update display of timer on browser window
    // shows tenth of seconds once less than 2 seconds remain
    // "shot clock" style
    var timeString = timeFormat(timerMilliSeconds);
    if (timerMilliSeconds < 2000) {
        $("#timeRemain").attr("class", "critical");
    } else {
        $("#timeRemain").attr("class", "notCritical");
    }
    $("#timeRemain").text(timeString);
}

function timerInit(sec) {
    // initialize the time
    // unhide the timer elements and set timer
    $(".timer").show();
    timerMilliSeconds = parseInt(sec) * 1000;
    timerUpdate();
}

function timerCount() {
    // runs each time interval
    // decrement the timer and re-display
    timerMilliSeconds -= 100;
    timerUpdate();
    // stop the time at 0 and record time up
    if (timerMilliSeconds <= 0) {
        timerStop();
        gameTimesUp();
    }
}

function GameCard (q, a1, a2, a3, a4, correctIndex, url) {
// game card constructor
    this.question = q;
    this.answers = [a1, a2, a3, a4];
    this.correctAnswerIndex = correctIndex;
    this.imageUrl = url;
}

function setUpTriviaCards() {
    gameTriviaCards.push( new GameCard("The World's Columbian Exposition, held in Chicago in 1893, introduced what delicacy to the city?", "pizza", "popcorn", "hot dogs", "funnel cakes", 2, "https://media.giphy.com/media/1azthmBeizvFe/giphy.gif"));
    gameTriviaCards.push( new GameCard("For what phenomenon is Chicago nicknamed 'the Windy City'?", "Wind off Lake Michigan", "Politician's bluster", "Tall ship at Navy Pier", "The smell of wild onions", 1, "https://media.giphy.com/media/l2Jeb1GZ6T677v35C/giphy.gif"));
    gameTriviaCards.push( new GameCard("Some say the name 'Chicago' comes from a Native American term for what food?", "Wild onion", "Red potato", "Soybean", "Lake Michigan whitefish", 0, "https://media.giphy.com/media/dtscHQF6qOeZzftFF6/giphy.gif"));
    gameTriviaCards.push( new GameCard("In what year was a third of the city razed in what became known as the Great Chicago Fire?", "1871", "1873", "1881", "1787", 0, "https://media.giphy.com/media/4TMqcN59kg3Yc/giphy.gif"));
    gameTriviaCards.push( new GameCard("The Prairie School of Architecture was born in what Chicago suburb?", "Prairie Park", "Oak Park", "Forest Park", "Park Forest", 1, "https://media.giphy.com/media/l4pTkS61NRruenNeM/giphy.gif"));
    gameTriviaCards.push( new GameCard("Chicago has how many miles of lakefront?", "12 miles", "22 miles", "29 miles", "18 miles", 2, "https://media.giphy.com/media/4gRiV4dDTytZ6/giphy.gif"));
    gameTriviaCards.push( new GameCard("What famous physicist produced the world's first controlled nuclear reaction at the University of Chicago?", "Robert Oppenheimer", "Felix Bloch", "Albert Einstein", "Enrico Fermi", 3, "https://media.giphy.com/media/FnatKdwxRxpVC/giphy.gif"));
    gameTriviaCards.push(new GameCard("Chicago's Home Insurance Building is often credited as the nation's first skyscraper. How tall was it when completed in 1885?", "5 stories", "10 stories", "13 stories", "15 stories", 1, "https://media.giphy.com/media/KuTaboloQFudG/giphy.gif"));
    gameTriviaCards.push(new GameCard("What famous Chicago author said 'Chicago is an October sort of city even in spring'?", "Saul Bellow", "Nelson Algren", "Carl Sandberg", "Upton Sinclair", 1, "https://media.giphy.com/media/5zs5usZXR6qWxhSqD9/giphy.gif"));
    gameTriviaCards.push(new GameCard("Which of these famous Chicagoans doesn’t have a statue in his likeness in the city?", "Michael Jordan", "Jerry Springer", "Jack Brickhouse", "Harry Carey", 1, "https://media.giphy.com/media/qYh5lpSMwYc6Y/giphy.gif"));
    gameTriviaCards.push(new GameCard("Why, according to Philip K. Wrigley, does the Wrigley Building have a sky bridge? ", "So William Wrigley could inspect shipments of gum as they cam in by boat on the river", "Because William Wrigley wanted an easier way to get to the other tower", "To create a single building, thereby skirting a law banning branch banking", "For achitectural stability, to keep the towers from falling over", 2, "https://media.giphy.com/media/2dmiD02aM9zX3Gw2oS/giphy.gif"));
    gameTriviaCards.push(new GameCard("How many operable drawbridges are there along the Chicago River?", "11", "18", "29", "37", 3, "https://media.giphy.com/media/MUAw2ydNacjOU/giphy.gif"));
    gameTriviaCards.push(new GameCard("What was the first film shot in Chicago after the city’s disastrous portrayal in 1969’s Medium Cool?", "Risky Business", "Ferris Bueller's Day Off", "The Blues Brothers", "Adventures in Babysitting", 2, "https://media.giphy.com/media/nBQefMWjqdLc4/giphy.gif"));
}

function gameWelcome() {
    // hide the timer
    $(".timer").hide();
    // hide the Question, Result, and Answer areas
    $("#gameQuestion").hide();
    $("#gameResult").hide();
    $("#gameAnswer").hide();
    // Provide instructions
    var gameInstructions = "<h4>Welcome to Chicago Trivia!</h4>";
    gameInstructions += "<p>Prove your knowledge of Chicago by answering " + numQuestions + " multiple choice questions.  You will have " + numSeconds + " seconds to answer each question.</p>";
    // click to begin
    gameInstructions += "<hr>";
    gameInstructions += "<p>Press the 'Start' button to begin</p>";
    gameInstructions += "<button type='button' class='btn btn-secondary' onclick='gameStart()'>START</button>";
    $("#gameMessage").html(gameInstructions);
}

function gameStart() {
    correctAnswers = 0; // reset counter
    wrongAnswers = 0; // reset counter
    noAnswers = 0; // reset counter
    answerSubmitted = false; // reset flag
    questionCount = 0; // reset counter
    gameTriviaCardIndexes = []; // empty the array
    // create the index of cards
    for (var i = 0; i < gameTriviaCards.length; i++) {
        gameTriviaCardIndexes.push(i);
    }
    if (debugFlag) {console.log("Index of Unused Cards:", gameTriviaCardIndexes);}
    currentTriviaCard = []; // empty the array
    timerIsStarted = false; // reset the flag

    // clear the welcome message and hide
    $("#gameMessage").html("");
    $("#gameMessage").hide();
    //un hide Question, Result, and Answer area
    $("#gameQuestion").show();
    $("#gameResult").show();
    $("#gameAnswer").show();

    displayNextQuestion();
}

function displayNextQuestion() {
    // increment the number of questions shown
    questionCount++;
    if (questionCount > numQuestions) {
        //branch to end game
        gameEnd();
    } else {
        // question screen
        // get the question
        currentTriviaCardIndex = Math.floor(Math.random() * gameTriviaCardIndexes.length);
        if (debugFlag) {console.log("Index from the unused indexes:",currentTriviaCardIndex);}
        // remove that question from the index
        useCardIndex = gameTriviaCardIndexes.splice(currentTriviaCardIndex, 1);
        if (debugFlag) {console.log("Index to use in Cards",useCardIndex);}
        if (debugFlag) {console.log("Unused indexes:",gameTriviaCardIndexes);}
        currentTriviaCard = gameTriviaCards[useCardIndex];
        if (debugFlag) {console.log("Card selected",currentTriviaCard);}

        // show question
        var questionText = "<h4>Question Number " + questionCount + "</h4>";
        questionText += "<p>";
        questionText += currentTriviaCard.question;
        questionText += "</p>";
        $("#gameQuestion").html(questionText);

        // show answers
        // randomize the answers
        var aArray = [];
        for (var i = 0; i < currentTriviaCard.answers.length; i++) {
            aArray.push(i);
        }
        while (aArray.length > 0) {
            // get a random answer
            var k = Math.floor(Math.random() * aArray.length);
            var aIndex = aArray.splice(k, 1);
            // add the answer
            var a = $("<div>");
            a.attr("aindex", aIndex);
            a.attr("class", "alert alert-warning answer");
            a.attr("role", "alert");
            a.attr("onclick", "chooseAnswer(" + aIndex + ")");
            a.text(currentTriviaCard.answers[aIndex]);
            $("#gameAnswer").append(a);
        }
        // set answerSubmitted to false
        answerSubmitted = false;
        // start timer
        timerInit(numSeconds);
        timerStart();
    }
}

function hideGif() {
        $("#gif").empty();
}
function showGif () {
    var gifimg = $("<img>");
    gifimg.attr("src",currentTriviaCard.imageUrl);
    gifimg.attr("width", "300");
    gifimg.attr("alt","gif image");
    $("#gif").html(gifimg);
}

function chooseAnswer(idx) {
    if (!answerSubmitted) {
        answerSubmitted = true;
        // stop the timer
        timerStop();
        // test for correct answer
        var gameResultText = "";
        var useColor = "";

        if (idx === currentTriviaCard.correctAnswerIndex) {
            // correct answer
            $("[aindex|='" + idx + "']").attr("class", "alert alert-success answer");
            correctAnswers++;
            useColor = "alert-success";
            showGif();
            // start message
            var gameResultText = "Correct Answer!";
        } else {
            // wrong answer
            $("[aindex|='" + idx + "']").attr("class", "alert alert-danger answer");
            wrongAnswers++;
            useColor = "alert-danger";
            showGif();
            // start message
            var gameResultText = "Wrong Answer!";
            gameResultText += " The correct answer was ";
            gameResultText += "<b>" + currentTriviaCard.answers[currentTriviaCard.correctAnswerIndex] + "</b>.";
        }
        var r = $("<div>");
        r.attr("class", "alert " + useColor + " result");
        r.attr("role", "alert");
        r.html(gameResultText);
        $("#gameResult").append(r);
        // wait 5 seconds, then next question OR end game
        setTimeout(clearCard, timeBetween*1000);
    }
}

function gameTimesUp() {
    // this function is called when the timer runs out before a question is answered.
    answerSubmitted = true;
    noAnswers++;
    useColor = "alert-danger";
    // start message
    var gameResultText = "Times Up!";
    gameResultText += " The correct answer was ";
    gameResultText += "<b>" + currentTriviaCard.answers[currentTriviaCard.correctAnswerIndex] + "</b>.";
    var r = $("<div>");
    r.attr("class", "alert " + useColor + " result");
    r.attr("role", "alert");
    r.html(gameResultText);
    $("#gameResult").append(r);
    showGif();
    // wait 5 seconds, then next question OR end game
    setTimeout(clearCard, timeBetween*1000);
}

function clearCard() {
    // clear the question, result, and answer areas
    $(".answer").remove();
    $(".result").remove();
    $("#gameQuestion").html = "";
    // clear the gif
    hideGif();
    // choose a new question
    displayNextQuestion();
}

function gameEnd() {
    // hide the timer
    $(".timer").hide();
    // hide the Question, Result, and Answer areas
    $("#gameQuestion").hide();
    $("#gameResult").hide();
    $("#gameAnswer").hide();

    // show a summary in the gameMessage area
    $("#gameMessage").show();
    // Provide instructions
    var gameSummary = "<h4>Game Summary</h4>";
    gameSummary += "<p>Of the " + numQuestions + " multiple choice questions, you correctly answered " + correctAnswers + ".";
    gameSummary += "  You answered " + wrongAnswers + " incorrectly and ran out of time on " + noAnswers + ".</p>";
    // click to begin
    gameSummary += "<hr>";
    gameSummary += "<p>Press the 'Re-Start' button to start over</p>";
    gameSummary += "<button type='button' class='btn btn-secondary' onclick='gameStart()'>RE-START</button>";
    // display
    $("#gameMessage").html(gameSummary);
}

// START HERE!
// everything is inside document.ready funciton to ensure page loads before any code is executed
$(document).ready(function () {
    setUpTriviaCards();
    if (debugFlag) {console.log("Array of Trivia Cards:", gameTriviaCards);};
    gameWelcome();
});