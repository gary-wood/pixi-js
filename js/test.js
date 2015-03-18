
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

function RGB2Color(r,g,b) { return '0x' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b); }
function byte2Hex(n) {
	var nybHexString = "0123456789ABCDEF";
	return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

var colourList = [];
function makeColorGradient(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len) {
	if (center == undefined)   center = 128;
	if (width == undefined)    width = 127;
	if (len == undefined)      len = 50;

	for (var i = 0; i < len; ++i) {
		var red = Math.sin(frequency1*i + phase1) * width + center;
		var grn = Math.sin(frequency2*i + phase2) * width + center;
		var blu = Math.sin(frequency3*i + phase3) * width + center;
		
		colourList.push(RGB2Color(red,grn,blu));
	}
}
makeColorGradient(.3,.3,.3,0,2,4);

var scene = {
	width: 800,
	height: 300,

	gravity: 1,

	lastTime: Date.now(),
	timeSinceLastFrame: 0
};

var stage = new PIXI.Stage(0x57D6DB);
var renderer = PIXI.autoDetectRenderer(scene.width, scene.height);

document.body.appendChild(renderer.view);

requestAnimFrame( animate );

var groundTile = new PIXI.TilingSprite (PIXI.Texture.fromImage("images/tile-ground.png"), scene.width, 32);

	groundTile.position.x = 0;
	groundTile.position.y = scene.height - 32;

	groundTile.frameCount = 0;
	groundTile.update = function() {
		// groundTile.tint = colourList[groundTile.frameCount];
	}
	groundTile.tint = 0x49cc28;

	groundTile.timer = setInterval(function() {
		groundTile.frameCount++;
		if (groundTile.frameCount >= colourList.length) groundTile.frameCount = 0;
	}, 90);

var bunny = new PIXI.Sprite(PIXI.Texture.fromImage("images/bunny.png"));

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

var ground = scene.height - groundTile.height;

stage.addChild(groundTile);
stage.addChild(bunny);


function animate() {

	requestAnimFrame( animate );
	
	renderer.render(stage);
	
	updateTime();
	bunny.update();
	groundTile.update();

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
		if ((bunny.velocity.x < 0 && bunny.rotation > (bunny.velocity.limitsX.min * 0.1)) ||
			(bunny.velocity.x > 0 && bunny.rotation < (bunny.velocity.limitsX.max * 0.1))) {
				bunny.rotation += (bunny.speed.r * bunny.velocity.x) * 0.05;
		}
	} else {
		if (bunny.rotation < 0) {
			bunny.rotation += (bunny.rotation * -1) / 5;
		} else if (bunny.rotation > 0) {
			bunny.rotation -= bunny.rotation / 5;
		}
	}

	bunny.position.y += bunny.speed.y * bunny.velocity.y;
	bunny.position.x += bunny.speed.x * bunny.velocity.x;

	if (bunny.position.x > scene.width + (bunny.width * 2)) {
		bunny.position.x = 0 - (bunny.width * 2);
	}

	if (bunny.position.x < 0 - (bunny.width * 2)) {
		bunny.position.x = scene.width + (bunny.width * 2);
	}

}





