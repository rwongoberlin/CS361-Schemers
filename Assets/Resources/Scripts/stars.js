//This keeps track of the number of stars each player has managed to earn for each level.
var owner : gameManager;
var best : int;
var okay : int;
var starArray : Array;

function init(numLevels : int, best : int, okay : int, o : gameManager) {
	this.best = best;
	this.okay = okay;
	starArray = new Array(numLevels);
	owner = o;
	for (int i = 0; i < numLevels; i++) {
		starArray[i] = 0;
	}
}

function setStars(score : int, level : int) {
	if (score <= this.best) {
		starArray[level] = 3;
	} else if (score < = this.okay) {
		starArray[level] = 2;
	} else {
		starArray[level] = 1;
	}
}

function returnScore(level : int) {
	return starArray[level];
}