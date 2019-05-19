// timer object
var timer = {
    isStarted: false,
    numMilliSeconds: 5000,
    intervalId: null,
    formatTime: function (millisec) {
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
    },
    updateTimer: function () {
        var timeString = this.formatTime(this.numMilliSeconds);
        if (this.numMilliSeconds < 2000) {
            $("#timeRemain").attr("class","critical");
        } else {
            $("#timeRemain").attr("class","notCritical");
        }
        $("#timeRemain").text(timeString);
        if (this.isStarted) {
            var timeMsg = "started";
        } else {
            var timeMsg = "stopped";
        }
        $("#timeMessage").text(timeMsg);
    },
    init: function (sec) {
        // create timer element if it does not exist
        if (!($("#timer".length) > 0)) {
            var timerElement = $("<div>");
            timerElement.attr("id", "timer");
            timerElement.html("Timer: <span id='timeRemain'></span>&nbsp;<span id='timeMessage'></span>");
            $("#gameTimer").append(timerElement);
        }
        this.numMilliSeconds = parseInt(sec) * 1000;
        this.updateTimer();
    },
    start: function () {
        if (!this.isStarted) {
            // note that setInterval is in the scope of the window object
            // rather than in the scope of this "timer" object
            this.intervalId = setInterval(this.count, 100);
            this.isStarted = true;
        }
    },
    stop: function () {
        clearInterval(this.intervalId);
        this.isStarted = false;
        this.updateTimer();
    },
    count: function () {
        // need to reference the object rather than `this`
        // apparently setInterval is in the scope of the window
        // and no longer in the scope of the object that initiated it
        timer.numMilliSeconds -= 100;
        timer.updateTimer();
        if (timer.numMilliSeconds <= 0) {
            timer.stop();
        }
    }
}

// var test = timer.formatTime(600000);
// $("#timerContainer").html(test);
// timer.init(10);
// timer.start();

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
        $("#timeRemain").attr("class","critical");
    } else {
        $("#timeRemain").attr("class","notCritical");
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
    $(" .timer").hide();
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
    // clear the welcome message
    $("#gameMessage").html("");
    displayNextQuestion();
}

function displayNextQuestion() {
    // increment the number of questions shown
    questionCount++;
    if (questionCount > numQuestions) {
        //branch to end game
        alert("game has ended");
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