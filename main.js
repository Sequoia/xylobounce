throttle = require('lodash.throttle');
// We create our only state
var mainState = {
	preload: function() {
		game.load.image('ball', 'assets/ball.png');
		game.load.image('line', 'assets/line.png');
	},
	create: function() {
		game.stage.backgroundColor = '#eee';
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//ball
		this.ball = game.add.sprite(game.world.centerX ,10, 'ball')
		this.ball.anchor.setTo(.5,.5);
		game.physics.enable( this.ball, Phaser.Physics.ARCADE );
		this.ball.body.gravity.y = 500;
		this.ball.body.bounce.x = 0; //calculating bounce in callback
		this.ball.body.bounce.y = 0;
		this.ball.checkWorldBounds = true;
		this.ball.outOfBoundsKill = true;

		//lines
		this.lines = game.add.group();
		this.lines.enableBody = true;
		//line
		this.line = game.add.sprite(game.world.centerX , 20, 'line', 0 )
		this.line.anchor.setTo(.5,.5);
		this.line.scale.setTo(5,5);
		this.line.angle = 45;
		game.physics.enable( this.line, Phaser.Physics.ARCADE );
		//this.line.body.gravity.y = 500;
		this.line.body.immovable = true;

		console.log("line body angle: " + this.line.body.angle);
		
	//debugger;	
	},
	update: function() {

		if( this.ball.inWorld ){
			//console.log(this.ball.body.angle, this.ball.body.velocity);
			//console.log(this.ball.body.angle * 57.295);
		}
		//collision
		game.physics.arcade.collide(this.ball,this.line,throttledBounceBall);//end throttle function
		// This function is called 60 times per second
	}
};

//changes ball trajectory when it hits a wall
//@arg Sprite ball
//@arg Sprite line
function bounceBall(ball,line){
	var bAngle;       //ball angle
	var inAngle;      //in angle (reverse of ball angle)
	var exitAngle;    //exit angle
	var normAngle;    //normal angle (perpendicular to wall)
	var angleDiff;    //diff between in angle & normal angle)

	//get ball angle in degrees instead of radians
	bAngle = ball.body.angle * 57.2957795;
	//get incoming angle (reverse ball angle)
	switch(true){
		case(Math.abs(bAngle) === 180): //ball going left
			inAngle = 0; console.log('case 1');break;
		case(bAngle === 0):             //ball going right
			inAngle = 180; console.log('case 2'); break;
		case (bAngle > 0):              //ball going down
			inAngle = bAngle - 180; console.log('case 3');break;
		case(bAngle < 0):               //ball going up
			inAngle = bAngle + 180; console.log('case 4');break;
	}
	//get wall normal angle (angle perpendicular to wall)
	//TODO at this point assuming we hit from the TOP
	//     hitting from bottom requires flipping this number
	normAngle = line.angle - 90;
	console.log('norm angle: ' + normAngle);
	//if(line.angle > 0 && normAngle){ //reverse if it's a positive angle so we get top left quad
		//normAngle = -normAngle;
	//}
	//get difference between incoming angle & normal angle
	var angleDiff = Math.abs( inAngle - normAngle );
	//exit angle is 2x diff TOWARDS normal angle
	if(normAngle > inAngle){ // bounce right
		exitAngle = inAngle + 2*angleDiff;
	}else{ //bounce left
		exitAngle = inAngle - 2*angleDiff;
	}
	//TODO try this alt method:
	//get exit angle (2 * normal - 180 - incoming)

	//exitAngle+=45;
	var velocity = game.physics.arcade
		.velocityFromAngle(exitAngle, ball.body.speed);
	console.log(velocity);

	console.log({
		inAngle: inAngle,
		normAngle: normAngle,
		exitAngle: exitAngle,
		angleDiff : angleDiff
	});

	ball.body.velocity = velocity;
}

var throttledBounceBall = throttle(bounceBall,1000,{leading:true, trailing:false});

//@return signed float of ball angle
//right side of circle is 1 to 179, left side is -1 to -179
//0 is straight up, 180 is straight down
function getBallDirection(ball){
	
}

// We initialising Phaser
var game = new Phaser.Game(400, 300, Phaser.AUTO, 'gameDiv');
// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
