
/*
	CIRCLE OBJECT - definition
	
	@param {number} x - center x coordinate of circle
	@param {number} y - center y coordinate of circle
	@param {number} radius - radius of circle
*/
function Circle(x, y, radius) {
	this.x = x;				//middle coordinate of circle x
	this.y = y;				//middle coordinate of circle y
	this.radius = radius;	//radius of circle
}


/*
	LINE OBJECT - definition
	
	@param {Circle} startPoint - start point of line
	@param {Circle} endPoint - end point of line
	@param {number} thickness - thickness/width of line
*/
function Line(startPoint, endPoint, thickness) {
	this.startPoint = startPoint;	//start point of line
	this.endPoint = endPoint;		//end point of line
	this.thickness = thickness;		//thickness of line
}


/*
	GLOBAL OBJECT - data can be stored there - but its not recommend to use it in this form
*/
var gameInfo = {
	circles: [],
	thinLineThickness: 1,
	lines: []
};


/*
	DRAWS LINE from (x1, y1) to (x2, y2)
	
	1. moves to initial point
	2. draws line to end point
	3. sets stroke style to #cfc and line width to thickness
	
	@param {Context} context - context from Canvas to perform paint operations
	@param {number} x1 - coordinate x of start point
	@param {number} y1 - coordinate y of start point
	@param {number} x2 - coordinate x of target point
	@param {number} y2 - coordinate y of target point
	@param {number} thickness - line thickness/width
	
*/
function drawLine(context, x1, y1, x2, y2, thickness) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineWidth = thickness;
	context.strokeStyle = "#cfc";
	context.stroke();
}


/*
	DRAWS CIRCLE ON CANVAS
	
	@param {Context} context - context from Canvas to perform paint operations
	@param {number} x - center x coordinate of circle
	@param {number} y - center y coordinate of circle
	@param {number} radius - radius of circle
*/
function drawCircle(context, x, y, radius) {
	context.fillStyle = "rgba(200, 200, 100, .9)";
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI*2, true);
	context.closePath();
	context.fill();
}


/*
	VECTOR 2D REPRESENTATION
	
	- stores information about its components
	
	@param {number} x - component x of the vector
	@param {number} y - component y of the vector
*/
function Vector(x, y) {
	this.x = x;
	this.y = y;
}


/*
	CONVERTS RADIANS TO DEGREES
	
	@param {number} angle - angle which should be converted to radians
*/
function toDegrees(angle) {
  return angle * (180 / Math.PI);
}


/*
	DRAWS CIRCLE ON CANVAS
	
	1. obtains canvas reference using given id
	2. extracts context from canvas
	3. draws circle to canvas using extracted context
	
	@param {number} x - center x coordinate of circle
	@param {number} y - center y coordinate of circle
	@param {number} radius - radius of circle
*/
function drawCircleInfo(x, y, radius){
	const canvas = document.getElementById("game");
	const context = canvas.getContext('2d');
	drawCircle(context, x, y, radius);
}


/*
	FINDS CENTER POINT OF POLYGON - ONLY FOR THOSE POLYGONS WHERE ALL POINTS LYING ON CIRCUMCIRCLE AND WITH EQUAL EDGES
	
	1. finds middle point from ordered points where ordering starts from initial one (average)
	2. creates vector from initial and middle point and gets its size 
	a) EVEN POINT POLYGONS
		1. half is radius for even numbered polygons)
	b) ODD POINT POLYGONS
		1. finds next point (behind inital) and middle point
		2. creates vector from these points and gets their size
		3. evaluates angle between these two vectors: Alfa = acos((ca.x*cb.x + ca.y * cb.y) / (|ca| * |cb|))
		4. evaluates average by using sinus equation: 2*r = |BA| / SIN(<ABC)
		5. final coordinates of resulting middle point where first line is horizontal are: 
		    [x,y] = [surX(A) + |BA| / 2, surY(A) + r]


	@param {Polygon} polygonClass - class with defined equal side polygon parameters
	@param {number} initialX - initial coordinate x of polygon
	@param {number} initialY - initial coordinate y of polygon
	@param {number} sideLength - length of side of polygon side
	@param {number} angleForPoint - angle to get next point of polygon
	@param {number} dimension - number of points which should result shape have
	@param {number} radius - radius of circle
*/
function findCenterPoint(polygonClass, initialX, initialY, sideLength, angleForPoint, dimension, radius){
	//FOR ODD DIMENSION
	//finds first line 
	//finds next point
	let nextX = initialX + Math.cos(degreeToRadians(0.0))*sideLength; //coordinate x of next point
	let nextY = initialY + Math.sin(degreeToRadians(0.0))*sideLength; //coordinate y of next point
	let x1 = nextX;
	let y1 = nextY;
	let x2, y2;
	let middleX, middleY;
	let angle = angleForPoint;
	
	//get middle and last point from points on circumcircle
	for(let i=1; i<	Math.round(dimension / 2); i++){
		x2 = x1 + Math.cos(degreeToRadians(angle))*sideLength;
		y2 = y1 + Math.sin(degreeToRadians(angle))*sideLength;
		
		//var canvas = document.getElementById("game");
		//var context = canvas.getContext('2d');
		//var x3, y3;
		//x3 = x1 - Math.cos(degreeToRadians(2*angle))*sideLength;
		//y3 = y1 + Math.sin(degreeToRadians(2*angle))*sideLength;
		//drawLine(context, x1, y1, x3, y3, 1);
		
		angle = angle + angleForPoint;
		x1 = x2;
		y1 = y2;
	}
	//get middle from points on circumcircle
	middleX = x2;
	middleY = y2;
	
	const bottom1Vector = new Vector(middleX - initialX, middleY - initialY);
	const sizeOfBottom1V = Math.sqrt(Math.pow(bottom1Vector.x, 2) + Math.pow(bottom1Vector.y, 2));
		
	if(dimension % 2 == 0){
		
		polygonClass.radius = sizeOfBottom1V / 2.0;
		drawCircleInfo(initialX + (middleX - initialX) / 2, initialY + (middleY - initialY) / 2, polygonClass.radius);
		return new Circle(initialX + (middleX - initialX) / 2, initialY + (middleY - initialY) / 2, radius);
	} else {
	
		const bottom2Vector = new Vector(middleX - nextX, middleY - nextY);
		const sizeOfBottom2V = Math.sqrt(Math.pow(bottom2Vector.x, 2) + Math.pow(bottom2Vector.y, 2)); 
	
		const angleOfVectors = (Math.acos((bottom1Vector.x*bottom2Vector.x + bottom1Vector.y*bottom2Vector.y) / (sizeOfBottom1V * sizeOfBottom2V)));
	
		//SINUS RULE  2R = a / SIN(FI), where a is top side and FI is angle from bottom vector
		polygonClass.radius= sideLength / (2.0 * Math.sin(angleOfVectors));
	
		//drawCircleInfo(initialX + sideLength / 2, middleY - polygonClass.radius, polygonClass.radius); //should be equal with:
		drawCircleInfo(initialX + sideLength / 2, initialY + polygonClass.radius, polygonClass.radius);
		//return new Circle(initialX + sideLength / 2, middleY - polygonClass.radius, radius); //should be equal with:
		return new Circle(initialX + sideLength / 2, initialY + polygonClass.radius, radius);
	}
}


/*
	POLYGON REPRESENTATION
	
	- stores information about its components
	
	@param {number} initialX - initial coordinate x of polygon
	@param {number} initialY - initial coordinate y of polygon
	@param {number} initialAngle - initial angle of polygon
*/
function Polygon(initialX, initialY, initialAngle){
	this.initialX = initialX;
	this.initialY = initialY;
	this.initialAngle = initialAngle;
}


/*
	EQUAL SIDE POLYGON REPRESENTATION
	
	@param {number} dimension - number of points which should result shape have
	@param {number} initialX - initial x coordinate where drawing starts
	@param {number} initialY - initial y coordinate where drawing starts
	@param {number} initialSideLength - initial length of side of polygon side
*/
function PolygonsMapInfo(dimension, initialX, initialY, initialSideLength){
	this.polygons = [];
	this.polygons.push(new Polygon(initialX, initialY, 0.0));
	this.sideLength = initialSideLength;
	this.dimension = dimension;
	this.angleForPoint = 360.0 / dimension;
	this.ruleString = createRule(dimension);
	//this.ruleStringGenerate = createAnotherRuleForSize5(dimension);
	console.log(this.ruleString);
	
	//another information
	this.radius;
	this.centerPoint = findCenterPoint(this, this.initialX, this.initialY, this.sideLength, this.angleForPoint, this.dimension, 5);
	this.setFinalSideLength = function(sideLength) { this.sideLength = sideLength; }
}


/*
	GENERATES POLYGONS IN ROW
	
	@param {Context} context - context from Canvas to perform paint operations
	@param {Canvas} canvas - canvas where shape will be drawn (associated with context)
	@param {PolygonsMapInfo} polygonsMapInfo - equal side polygon mapping representation
	@param {number} initialX - initial x coordinate where drawing starts
	@param {number} initialY - initial y coordinate where drawing starts
	@param {number} circleRadius - radius for newly created points
*/
function generatePolygonsInRow(context, canvas, polygonsMapInfo, initialX, initialY, circleRadius){
	let polygon, polygon1, polygon2;
	let polygon2Array = [];
	polygon = createAnother(context, canvas, polygonsMapInfo, initialX, initialY, 0.0, circleRadius);
	for (let j = 0; j < 15; j++){
		polygon2Array.push(createAnother(context, canvas, polygonsMapInfo, polygon.initialX, polygon.initialY, polygon.initialAngle, circleRadius,3));
		for (let i = 1; i < 15; i++){
			polygon = createAnother(context, canvas, polygonsMapInfo, polygon.initialX, polygon.initialY, polygon.initialAngle, circleRadius,2);
		}
		polygon = polygon2Array.pop();
	}
	
	for(polygonInstance of polygon2Array){
		createAnother(context, canvas, polygonsMapInfo, polygonInstance.initialX, polygonInstance.initialY, polygonInstance.initialAngle, circleRadius,3)
	}
}


/*
	DRAWS ANOTHER EQUAL SIDE POLYGON ACCORDING PREPARED STRING
	
	@param {Context} context - context from Canvas to perform paint operations
	@param {Canvas} canvas - canvas where shape will be drawn (associated with context)
	@param {PolygonsMapInfo} polygonsMapInfo - equal side polygon mapping representation
	@param {String} ruleString - base/initial equal side polygon rule string (which should be extended in each iteration)
	@param {number} sideLength - initial length of side of koch shape 
	@param {number} circleRadius - radius for newly created points
	@param {number} index - number of rotation from initial point to new point (to be able to start drawing new shape)
*/
function createAnother(context, canvas, polygonsMapInfo, initialX, initialY, angleOfPolygon, circleRadius, index) {
	let x1 = initialX;
	let y1 = initialY;
	let x2, y2;
	let x3, y3;
	let angle = angleOfPolygon;
	let newPolygon;
	
	//get middle and last point from points on circumcircle
	for (let i=0; i < index; i++){
		x2 = x1 + Math.cos(degreeToRadians(angle))*polygonsMapInfo.sideLength;
		y2 = y1 + Math.sin(degreeToRadians(angle))*polygonsMapInfo.sideLength;
		
		angle = angle + polygonsMapInfo.angleForPoint;
		x1 = x2;
		y1 = y2;
	}
	
	x3 = x1 + Math.cos(degreeToRadians(angle))*polygonsMapInfo.sideLength;
	y3 = y1 + Math.sin(degreeToRadians(angle))*polygonsMapInfo.sideLength;
	
	if (angle % 365.0 > 180.0) {
		const vectSide = new Vector(x3 - x1, y3 - y1);
		const vectInitial = new Vector(x1 /*2*x3 - x3*/, 0.0 /*y3 - y3*/);
		const vectSideSize = Math.sqrt(Math.pow(vectSide.x, 2) + Math.pow(vectSide.y, 2));
		const vectInitialSize = Math.sqrt(Math.pow(vectInitial.x, 2) + Math.pow(vectInitial.y, 2));
	
		const newAngle = toDegrees(Math.acos((vectSide.x*vectInitial.x + vectSide.y*vectInitial.y)/(vectSideSize * vectInitialSize)));
	
		newPolygon = new Polygon(x1, y1, 360.0 - newAngle);
	} else { 
		const vectSide = new Vector(x1 - x3, y1 - y3);
		const vectInitial = new Vector(x3 /*2*x3 - x3*/, 0.0 /*y3 - y3*/);
		const vectSideSize = Math.sqrt(Math.pow(vectSide.x, 2) + Math.pow(vectSide.y, 2));
		const vectInitialSize = Math.sqrt(Math.pow(vectInitial.x, 2) + Math.pow(vectInitial.y, 2));
	
		const newAngle = toDegrees(Math.acos((vectSide.x*vectInitial.x + vectSide.y*vectInitial.y)/(vectSideSize * vectInitialSize)));
	
		newPolygon = new Polygon(x3, y3, 360.0 - newAngle);
	}
	
	drawShapeFromInitialAngle(context, canvas, newPolygon, polygonsMapInfo, polygonsMapInfo.ruleString, polygonsMapInfo.angleForPoint, polygonsMapInfo.sideLength, circleRadius);
	
	return newPolygon;
	//drawShapeFromInitialAngle(context, canvas, new Polygon(x1, y1, 2*angle), polygonsMapInfo, polygonsMapInfo.ruleString, polygonsMapInfo.angleForPoint, polygonsMapInfo.sideLength, circleRadius);
}


/*
	CREATE RULE TO GENERATE POLYGONS LYING ON CIRCUMCIRCLE
	
	@param {number} dimension - number of points which should result shape have
*/
function createRule(dimension){
	if(dimension < 3) {
		console.log("WRONG DIMENSION");
	}
	
	let string = "";
	for(let i=0; i<dimension - 1; i++){
		string = string + "R+";
	}
	
	return string + "R";
}


/*
	CONVERTS DEGREES TO RADIANS
	
	@param {number} angle - angle which should be converted to radians
*/
function degreeToRadians(angle){
	return Math.PI * angle / 180.0;
}


/*
	DRAWS EQUAL SIDE POLYGON ACCORDING PREPARED STRING
	
	@param {Context} context - context from Canvas to perform paint operations
	@param {Canvas} canvas - canvas where shape will be drawn (associated with context)
	@param {PolygonsMapInfo} polygonsMapInfo - equal side polygon mapping representation
	@param {String} ruleString - base/initial equal side polygon rule string (which should be extended in each iteration)
	@param {number} sideLength - initial length of side of koch shape 
	@param {number} radius - radius for newly created points
*/
function drawShape(context, canvas, polygon, polygonsMapInfo, ruleString, angleForPoint, sideLength, radius){
	const canvasWidth = canvas.width;
	const canvasHeight = canvas.height;
	let x1 = polygon.initialX;	//initial x
	let y1 = polygon.initialY;	//initial y
	let x2, y2;
	let angle = 0.0; //initial angle
	let point1 = new Circle(x1,y1, radius);
	let point2;
	let thickness = 1;
	gameInfo.circles.push(point1);
	drawCircle(context, x1, y1, radius);
	
	for(let i=0; i<ruleString.length; i++){
		
		// NEW POINT 
		if(ruleString[i] == 'R'){
			// EVALUATES NEW COORDINATES (x2, y2)
			x2 = x1 + Math.cos(degreeToRadians(angle))*sideLength;
			y2 = y1 + Math.sin(degreeToRadians(angle))*sideLength;
			
			// CREATES NEW POINT (x2, y2)
			point2 = new Circle(x2, y2, radius);
			drawCircle(context, x2, y2, radius);
			
			// CONNECTS NEW POINT WITH PREVIOUS ONE
			//if(x2 > 0.0 && y2 > 0.0 && x2 < canvasWidth && y2 < canvasHeight){
				gameInfo.lines.push(new Line(point1, point2, thickness));
				drawLine(context, x1, y1, x2, y2, thickness);
			//}
			
			//old points will be second and previous will be overwritten
			// SETS NEW POINT AS OLD ONE
			x1 = x2;
			y1 = y2;
			point1 = point2;
			
			
		// LEFT ROTATION
		} else if(ruleString[i] == '+'){
			angle = angle + angleForPoint;
			if(angle >= 360.0) {
				angle = 0.0;
			}
			
		// RIGHT ROTATION
		} else if(ruleString[i] == '-'){
			angle = angle - angleForPoint;
			if(angle <= - angleForPoint) {
				angle = 360.0 - angleForPoint;
			}
		}
		
	}
	
	drawCircle(context, polygonsMapInfo.centerPoint.x, polygonsMapInfo.centerPoint.y, polygonsMapInfo.centerPoint.radius);
}


/*
	DRAWS EQUAL SIDE POLYGON ACCORDING PREPARED STRING
	
	@param {Context} context - context from Canvas to perform paint operations
	@param {Canvas} canvas - canvas where shape will be drawn (associated with context)
	@param {PolygonsMapInfo} polygonsMapInfo - equal side polygon mapping representation
	@param {String} ruleString - base/initial equal side polygon rule string (which should be extended in each iteration)
	@param {number} sideLength - initial length of side of koch shape 
	@param {number} radius - radius for newly created points
*/
function drawShapeFromInitialAngle(context, canvas, polygon, polygonsMapInfo, ruleString, angleForPoint, sideLength, radius){
	const canvasWidth = canvas.width;
	const canvasHeight = canvas.height;
	let x1 = polygon.initialX;	//initial x
	let y1 = polygon.initialY;	//initial y
	let x2, y2;
	let angle = polygon.initialAngle; //initial angle
	let point1 = new Circle(x1, y1, radius);
	let point2;
	let thickness = 1;
	gameInfo.circles.push(point1);
	drawCircle(context, x1, y1, radius);
	
	for(let i=0; i<ruleString.length; i++){
		
		// NEW POINT 
		if(ruleString[i] == 'R'){
			// EVALUATES NEW COORDINATES (x2, y2)
			x2 = x1 + Math.cos(degreeToRadians(angle))*sideLength;
			y2 = y1 + Math.sin(degreeToRadians(angle))*sideLength;
			
			// CREATES NEW POINT (x2, y2)
			point2 = new Circle(x2, y2, radius);
			drawCircle(context, x2, y2, radius);
			
			// CONNECTS NEW POINT WITH PREVIOUS ONE
			//if(x2 > 0.0 && y2 > 0.0 && x2 < canvasWidth && y2 < canvasHeight){
				gameInfo.lines.push(new Line(point1, point2, thickness));
				drawLine(context, x1, y1, x2, y2, thickness);
			//}
			
			// SETS NEW POINT AS OLD ONE
			//old points will be second and previous will be overwritten
			x1 = x2;
			y1 = y2;
			point1 = point2;
			
		// LEFT ROTATION
		} else if(ruleString[i] == '+'){
			angle = angle + angleForPoint;
			if(angle >= 360.0) {
				angle = angle - 360.0;
			}
			
		// RIGHT ROTATION
		} else if(ruleString[i] == '-'){
			angle = angle - angleForPoint;
			if(angle <= - angleForPoint) {
				angle = 360.0 - angleForPoint;
			}
		}
		
	}
	
	drawCircle(context, polygonsMapInfo.centerPoint.x, polygonsMapInfo.centerPoint.y, polygonsMapInfo.centerPoint.radius);
}


/*
	INITIAL FUNCTION
	
	1. Obtains context from HTML element
	2. Prepares/initializes Polygons structure
	3. Draws polygons near to each other
*/
$(function() {
	var canvas = document.getElementById("game");
	var context = canvas.getContext('2d');
	var circleRadius = 5;
	var numberIterations = 1;
	var polygonsMapInfo = new PolygonsMapInfo(6, 100, 100, 50);
	
	// DRAWS SINGLE POLYGON  WITH EQUAL SIDES - NOT INTERFARE WITH POLYGON WEB (STANDALONE)
	drawShape(context, canvas, polygonsMapInfo.polygons[0], polygonsMapInfo, polygonsMapInfo.ruleString, polygonsMapInfo.angleForPoint, polygonsMapInfo.sideLength, circleRadius);
	
	// DRAWS SINGLE POLYGON WEB
	generatePolygonsInRow(context, canvas, polygonsMapInfo, 100, 500, circleRadius);
});