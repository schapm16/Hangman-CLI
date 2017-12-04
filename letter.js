var Letter = function(correctLetter) {
    this.present = '_';
    this.correctLetter = correctLetter;
};

Letter.prototype.update = function() {
        this.present = this.correctLetter;
};
    
module.exports = Letter;