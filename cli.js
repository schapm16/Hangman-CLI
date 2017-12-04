// Incorporate npm packages
var prompt = require('prompt');
var colors = require('colors/safe');

// Incorporate modules
var phraseArray = require('./phrases.js');
var Word = require('./word.js');

// Initial array to hold the individual words in the selected phrase
var wordsArray = [];

// Number of guesses remaining in a round
var numGuesses = 5;

// An array of the letters already guessed by user.  Used to prevent user from being penalized for duplicate guesses.
var lettersGuessed = [];

// Holds the total number of letters in a given phrase.  Defined in wordSetup(). Used in gameplay() to determine when a user wins.
var totalLetters = 0;
// Holds the total number of correctLetters.  Used to compare to totalLetters to determine when a user wins.  Defined in decision().
var correctLetters = 0;

// Sets up parameters for prompt npm -- Limits user to letter guesses only during gameplay
var userInputPrompt = {
  properties: {
    Letter: {
      description: colors.cyan('Your Guess'),
      pattern: /^[a-zA-Z]+$/,
      message: colors.red('Enter a letter smart aleck'),
      required: true
    }
  }
};

// Sets up parameters for  prompt npm -- Limits user to 'y' or 'n' when asked if they want to play again
var playAgainPrompt = {
  properties: {
    Response: {
      description: colors.cyan('y or n'),
      pattern: /^[yn]+$/,
      message: "Enter either y or n",
      required: true
    }
  }
};

// Change prompt npm default 'messsage' and 'delimiter' display
prompt.message = "";
prompt.delimiter = colors.cyan(" >");


// >>>>Function Declarations<<<<

function wordSetup() { // Selects the phrase from phrases.js and parses each word in the phrase using word.js
  var random = Math.floor(Math.random() * phraseArray.length);
  wordsArray = phraseArray[random].split(" ");
  phraseArray.splice(random, 1); // Removes the phrase selected from phraseArray so that it cannot be selected again later

  for (var i = 0; i < wordsArray.length; i++) {
    totalLetters = totalLetters + wordsArray[i].length; // Results in the total number of letters in the selected phrase.  See description in variable declaration above.
    wordsArray[i] = new Word(wordsArray[i]); // Constructor on word.js
    wordsArray[i].parseWord(); // See word.js for description.
  }

}

function display() { // Used to display the gameboard at the beginning of each game and turn

  console.log("\nGuess a Letter!\n");

  var wordString = "";
  for (var j = 0; j < wordsArray.length; j++) {
    for (var k = 0; k < wordsArray[j].letterArray.length; k++) {
      wordString = wordString + wordsArray[j].letterArray[k].present + " ";
    }

    wordString = wordString + " ";
  }
  console.log(wordString + "\n");
}

function decision(guessedLetter) { // This is the score keeper function that evaluates the user's letter guess and decides how to handle it.
  var correctGuess = false;

  if (lettersGuessed.indexOf(guessedLetter) === -1) {
    lettersGuessed.push(guessedLetter);
    for (var j = 0; j < wordsArray.length; j++) {
      for (var k = 0; k < wordsArray[j].letterArray.length; k++) {
        if (guessedLetter.toLowerCase() === wordsArray[j].letterArray[k].correctLetter.toLowerCase()) {
          wordsArray[j].letterArray[k].update(); // This method is found on letter.js
          correctGuess = true;
          correctLetters++;
        }
      }
    }
    if (correctGuess === true) {
      console.log(colors.green('\nCorrect!'));
    }
    else if (correctGuess === false) {
      numGuesses--;
      console.log(colors.red('\nIncorrect\nNumber of Guesses Remaining: ' + numGuesses));
    }
  }
  else { // If user's guess is found in lettersGuessed array
    console.log(colors.yellow('You already guessed this letter!'));
  }
}

function reset() {
  numGuesses = 8;
  wordsArray.splice(0, wordsArray.length);
  lettersGuessed.splice(0, lettersGuessed.length);
  correctLetters = 0;
  totalLetters = 0;

  wordSetup();
  gameplay();
}

function playAgain() {
  prompt.get(playAgainPrompt, function(err, result) {
    if (result.Response === 'y') {
      reset();
    }
    else {
      console.log(colors.green('\nGoodBye!!\n'));
    }
  });
}

function gameplay() {
  display();

  prompt.start();

  prompt.get(userInputPrompt, function(err, result) {
    decision(result.Letter);

    if (correctLetters === totalLetters) {
      display();
      console.log(colors.green('\n!!!!Congratulations!  You got it!!!!'));
      console.log(colors.white('\nWould you like to continue?'));

      playAgain();
    }
    else if (numGuesses > 0) {
      gameplay();
    }
    else {
      console.log(colors.red('\n!!!!YOU LOST!!!!'));
      console.log(colors.white('\nWould you like to play again?'));

      playAgain();
    }
  });
}

//>>>>GamePlay Execution Starts Here<<<<
wordSetup();
gameplay();
