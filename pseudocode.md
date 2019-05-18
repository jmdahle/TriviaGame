# Trivia Game

### pseudocode
1. initialize game
    1.1 set up (blank) variables for player name, number of questions, correct answers, incorrect answers, questions answered, time per question
    1.1 set up timeinterval as the question timer
    1.1 set up timeout as the wait timer (when result is displayed)
1. welcome screen
1.1. provide instructions
1.1. enter name to begin
1. initialize game
1.1. re-set questions and answers
1.1. re-set number of questions, correct answers, incorrect answers, questions answered, time per question
1. play screen
1.1. display coundown timer
1.1.1. display in colors as time runs down
1.1.1. sound (and exit) when time runs out
1.1. display question
1.1. display answers in random order
1.1. click to choose an answer
1.1.1. if answer is wrong, increment wrong answers
1.1.1. if answer is correct, increment correct answers
1.1.1. if out of time, increment wrong answers
1. display result
1.1 wait
1.1.1. if questions remain, then move to next question
1.1.1. if max number of questions reached, continue to summary)
1. display summary of game results
1.1. option to restart (no name change)
1.1. option to quite (back to beginning)

#### HTML assets
1. timer
1.1. timerContainer
1.1. timerTimeRemaining
1.1. timerMessage
1. gamePanel
1.1. gamePanelTitle
1.1. gamePanel
