﻿var x : float;
var y : float;
var comingFrom : float;
var goingTo : float;

var currentTile : tile; 
var nextTile : tile; 
var clock : float;
var tempTime : float;
var speed : float;

var model;

var tiles : Array;
var numtargets : int;

function init(row : float, column : float, r : float, Tile : tile, tileList : Array, typeL : int, targets : Array, characters : Array) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);	// Create a quad object for holding the marble texture.
	model = modelObject.AddComponent("characterModel");					// Add a marbleModel script to control visuals of the marble.
	model.init(this, row, column, r, Tile, tileList, typeL, targets, characters);													// Initialize the model.   
}
