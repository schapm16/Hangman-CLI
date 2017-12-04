var Letter = require("./letter.js");

// Word constructs an object for each word in the phrase provided from cli.js.
// It contains a string of the full word and an array
// of Letter objects constructed via letter.js
var Word = function(word) {
  this.word = word;
  this.letterArray = [];
};

Word.prototype.parseWord = function() { // Constructs a new Letter object for each letter in the word
  var x;

  for (var i = 0; i < this.word.length; i++) {
    x = new Letter(this.word[i]);
    this.letterArray.push(x);
  }

};

module.exports = Word;
