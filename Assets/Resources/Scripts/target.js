var x : int;
var y : int;
var type : int;
var count : int; // 1 2 3

function init(xS : int, yS : int, typeS : int, countS : int) {
	var modelObject = GameObject.CreatePrimitive(PrimitiveType.Quad);
	x = xS;
	y = yS;
	type = typeS;
	count = countS;
	model = modelObject.AddComponent("targetModel");
	model.init(this, type, count);
}

function getCount() {
	return count;
}

function getX() {
	return x;
}

function getY() {
	return y;
}

function destroy() {
	Destroy(this.gameObject);
}