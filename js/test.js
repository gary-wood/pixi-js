
var Key = {
	_pressed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	}
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);


var scene = {
	width: 800,
	height: 300,

	gravity: 1,

	lastTime: Date.now(),
	timeSinceLastFrame: 0
};

var stage = new PIXI.Stage(0x66FF99);
var renderer = PIXI.autoDetectRenderer(scene.width, scene.height);

document.body.appendChild(renderer.view);

requestAnimFrame( animate );

var texture = PIXI.Texture.fromImage("images/bunny.png");
var bunny = new PIXI.Sprite(texture);

	bunny.anchor.x = 0.5;
	bunny.anchor.y = 0.5;

	bunny.position.x = scene.width / 2;
	bunny.position.y = -bunny.height;

	bunny.velocity = {
		x: 0,
		y: 0,

		limitsX: {
			min: -8,
			max: 8
		}
	};

	bunny.speed = {
		x: 0.75,
		y: 0.75,
		r: 0.1
	};

	bunny.onTheGround = false;
	bunny.isJumping = false;

var ground = scene.height;

stage.addChild(bunny);

function animate() {

	requestAnimFrame( animate );
	
	renderer.render(stage);

	bunny.update();
	updateTime();

}

function updateTime() {
	var now = Date.now()

	scene.timeSinceLastFrame = now - scene.lastTime;
	scene.lastTime = now;
}

bunny.update = function() {

	bunny.onTheGround = (bunny.position.y >= ground - (bunny.height / 2));

	if (!bunny.onTheGround && !bunny.isJumping) bunny.velocity.y += scene.gravity;
	
	if (bunny.onTheGround) {
		bunny.position.y = ground - (bunny.height / 2);
		bunny.velocity.y = 0;
	}

	if (bunny.isJumping) {
		if (bunny.onTheGround) {
			bunny.velocity.y = -40;
		} else {
			bunny.velocity.y += (scene.gravity * scene.timeSinceLastFrame) / 2;
		}

		if (bunny.velocity.y >= 0) { bunny.isJumping = false; }
	}

	if (Key.isDown(Key.UP))	{
		if (bunny.onTheGround) {
			bunny.isJumping = true;
		}
	}

	if (Key.isDown(Key.LEFT)) {
		if (bunny.velocity.x > bunny.velocity.limitsX.min) {
			bunny.velocity.x -= bunny.speed.x * scene.timeSinceLastFrame;
		}
	}

	if (Key.isDown(Key.DOWN)) {}

	if (Key.isDown(Key.RIGHT)) {
		if (bunny.velocity.x < bunny.velocity.limitsX.max) {
			bunny.velocity.x += bunny.speed.x * scene.timeSinceLastFrame;
		}
	}

	if (!Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT)) {
		bunny.velocity.x = 0;
	}

	

	if (bunny.velocity.x !== 0) {
		bunny.rotation += (bunny.speed.r * bunny.velocity.x) * 0.05;	
	} else {
		if (bunny.rotation < 0) {
			bunny.rotation += bunny.speed.r * 0.75;
		} else if (bunny.rotation > 0) {
			bunny.rotation -= bunny.speed.r * 0.75;
		}
	}

	bunny.position.y += bunny.speed.y * bunny.velocity.y;
	bunny.position.x += bunny.speed.x * bunny.velocity.x;

}





