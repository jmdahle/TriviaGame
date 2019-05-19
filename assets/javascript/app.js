
// global variables
var numQuestions = 3; // number of questions in a round
var correctAnswers = 0; // counter for number of correct answers
var wrongAnswers = 0; // counter for number of wrong answers
var noAnswers = 0; // counter for number times no answer was selected before time ran out
var answerSubmitted = false;
var questionCount = 0; // counter for number of questions presented
var numSeconds = 10; // number of seconds for each question
var gameTriviaCards = []; // array of all questions and answers
var gameTriviaCardIndexes = []; // array of the cards (for randomizing question order)
var currentTriviaCard = []; // current trivia card in play
var timerIsStarted = false; // flag for if time is started (true) or stopped (false)
var timerId = null // the timer for setInterval
var timerMilliSeconds = 0; // the number of milliseconds on the timer

function timerStart() {
    if (!timerIsStarted) {
        // note that setInterval is in the scope of the window object
        timerId = setInterval(timerCount, 100);
        timerIsStarted = true;
    }
}

function timerStop() {
    clearInterval(timerId);
    timerIsStarted = false;
    timerUpdate();
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
    var timeString = timeFormat(timerMilliSeconds);
    if (timerMilliSeconds < 2000) {
        $("#timeRemain").attr("class", "critical");
    } else {
        $("#timeRemain").attr("class", "notCritical");
    }
    $("#timeRemain").text(timeString);
}

function timerInit(sec) {
    // unhide the timer elements
    $(".timer").show();
    timerMilliSeconds = parseInt(sec) * 1000;
    timerUpdate();
}

function timerCount() {
    timerMilliSeconds -= 100;
    timerUpdate();
    if (timerMilliSeconds <= 0) {
        timerStop();
        gameTimesUp();
    }
}

function setUpTriviaCards() {
    // format of Trivia Cards: question, answer(s) = however many you want, last index is index in the array of the correct answer.
    gameTriviaCards.push(["Question1?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question2?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question3?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question4?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question5?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question6?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question7?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question8?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question9?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question10?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question11?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
    gameTriviaCards.push(["Question12?", "Correct answer", "answer 2", "answer 3", "answer 4", 1]);
}

function gameWelcome() {
    // hide the timer
    $(".timer").hide();
    // hide the Question, Result, and Answer areas
    $("#gameQuestion").hide();
    $("#gameResult").hide();
    $("#gameAnswer").hide();
    // Provide instructions
    var gameInstructions = "<h4>Welcome to TRIVIA!</h4>";
    gameInstructions += "<p>Prove your knowledge by answering " + numQuestions + " multiple choice questions.  You will have " + numSeconds + " seconds to answer each question.</p>";
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
        // remove that question from the index
        gameTriviaCardIndexes.splice(currentTriviaCardIndex, 1);
        currentTriviaCard = gameTriviaCards[currentTriviaCardIndex];
        // show question
        var questionText = "<h4>Question Number " + questionCount + "</h4>";
        questionText += "<p>";
        questionText += currentTriviaCard[0];
        questionText += "</p>";
        $("#gameQuestion").html(questionText);

        // show answers
        // randomize the answers
        var aArray = [];
        for (var i = 1; i < currentTriviaCard.length - 1; i++) {
            // goes from SECOND index to NEXT TO LAST index... skips the question and answer
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
            a.text(currentTriviaCard[aIndex]);
            $("#gameAnswer").append(a);
        }
        // set answerSubmitted to false
        answerSubmitted = false;
        // start timer
        timerInit(numSeconds);
        timerStart();
    }
}

function chooseAnswer(idx) {
    if (!answerSubmitted) {
        answerSubmitted = true;
        // stop the timer
        timerStop();
        // test for correct answer
        var gameResultText = "";
        var useColor = "";

        if (idx === currentTriviaCard[currentTriviaCard.length - 1]) {
            // correct answer
            $("[aindex|='" + idx + "']").attr("class", "alert alert-success answer");
            correctAnswers++;
            useColor = "alert-success";
            // start message
            var gameResultText = "Correct Answer!";
        } else {
            // wrong answer
            $("[aindex|='" + idx + "']").attr("class", "alert alert-danger answer");
            wrongAnswers++;
            useColor = "alert-danger";
            // start message
            var gameResultText = "Wrong Answer!";
            gameResultText += " The correct answer was ";
            gameResultText += "<b>" + currentTriviaCard[currentTriviaCard[currentTriviaCard.length - 1]] + "</b>.";
        }
        var r = $("<div>");
        r.attr("class", "alert " + useColor + " result");
        r.attr("role", "alert");
        r.html(gameResultText);
        $("#gameResult").append(r);
        // wait 5 seconds, then next question OR end game
        setTimeout(clearCard, 5000);
    }
}

function gameTimesUp() {
    // this function is called when the timer runs out before a question is answered.
    noAnswers++;
    useColor = "alert-danger";
    // start message
    var gameResultText = "Times Up!";
    gameResultText += " The correct answer was ";
    gameResultText += "<b>" + currentTriviaCard[currentTriviaCard[currentTriviaCard.length - 1]] + "</b>.";
    var r = $("<div>");
    r.attr("class", "alert " + useColor + " result");
    r.attr("role", "alert");
    r.html(gameResultText);
    $("#gameResult").append(r);
    // wait 5 seconds, then next question OR end game
    setTimeout(clearCard, 5000);
}

function clearCard() {
    // clear the question, result, and answer areas
    $(".answer").remove();
    $(".result").remove();
    $("#gameQuestion").html = "";
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
setUpTriviaCards();
// create the index of cards
for (var i = 0; i < gameTriviaCards.length; i++) {
    gameTriviaCardIndexes.push(i);
}
gameWelcome();


// if number of questions, proceed to summary

// summary screen
// show scores
// restart or end