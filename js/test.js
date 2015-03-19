(function myTestGame() {

	var Game = function() {

		this.renderer = null;

		this.scene = {
			gravity: 1,
			lastTime: Date.now(),
			timeSinceLastFrame: 0,
			stage: new PIXI.Stage(0x57D6DB),
			assets: []
		};
		
		this.init = function(sceneParams) {

			var self = this;
			var scene = self.scene;

			for (setting in sceneParams) {
				scene[setting] = sceneParams[setting];
			}

			this.renderer = PIXI.autoDetectRenderer(scene.width, scene.height);

			document.body.appendChild( this.renderer.view );

			this.createAssets();

			this.bindListeners();

			for (var asset = 0; asset < scene.assets.length; asset++) {
				scene.stage.addChild(scene.assets[asset]);
			}

			requestAnimFrame( animate.bind(self) );

		};

		var animate = function() {
			requestAnimFrame( animate.bind(this) );
			
			this.renderer.render( this.scene.stage );
			
			this.updateTime();

			for (var asset = 0; asset < this.scene.assets.length; asset++) {
				var drawEl = this.scene.assets[asset];

				if (typeof drawEl.update === 'function') {
					drawEl.update();
				}
			}
		};
	
	};

	var Key = {
		_pressed: {},

		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		SPACE: 32,

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

	Game.prototype.bindListeners = function() {
		window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
	};

	Game.prototype.updateTime = function() {
		var now = Date.now()

		this.scene.timeSinceLastFrame = now - this.scene.lastTime;
		this.scene.lastTime = now;
	};

	Game.prototype.animate = function() {
		
		var self = Game;

		requestAnimFrame( animate );
		
		this.renderer.render( this.scene.stage );
		
		this.updateTime();
		bunny.update();
		groundTile.update();

	}

	function animate() {
		Game.animate();
	}

	Game.prototype.createAssets = function() {

		var scene = this.scene;

		var groundTile = new PIXI.TilingSprite (PIXI.Texture.fromImage("images/tile-ground.png"), scene.width, 32);

			groundTile.position.x = 0;
			groundTile.position.y = scene.height - 32;

			groundTile.frameCount = 0;
			
			groundTile.update = function() {}
			
			groundTile.tint = 0x49cc28;

		scene.assets.push(groundTile);

		var ground = scene.height - groundTile.height;

		var bunny = new PIXI.Sprite(PIXI.Texture.fromImage("images/bunny.png"));

			bunny.anchor.x = 0.5;
			bunny.anchor.y = 0.5;

			bunny.position.x = scene.width / 2;
			bunny.position.y = -bunny.height;

			bunny.velocity = {
				x: 0,
				y: 0,

				limitsX: {
					min: -8.5,
					max: 8.5
				}
			};

			bunny.speed = {
				x: 1,
				y: 0.75,
				r: 0.5
			};

			bunny.onTheGround = false;
			bunny.isJumping = false;
			bunny.isPewpew = false;

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

				if (Key.isDown(Key.RIGHT)) {
					if (bunny.velocity.x < bunny.velocity.limitsX.max) {
						bunny.velocity.x += bunny.speed.x * scene.timeSinceLastFrame;
					}
				}

				if (!Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT)) {
					bunny.velocity.x = 0;
				}

				if (Key.isDown(Key.SPACE)) {
					bunny.isPewpew = true;
					scene.stage.addChild(pewpew);
					pewpew.update();
				} else {
					bunny.isPewpew = false;
					pewpew.reset();
				}

				if (bunny.velocity.x !== 0) {
					if ((bunny.velocity.x < 0 && bunny.rotation > (bunny.velocity.limitsX.min * 0.1)) ||
						(bunny.velocity.x > 0 && bunny.rotation < (bunny.velocity.limitsX.max * 0.1))) {
							bunny.rotation += (bunny.speed.r * bunny.velocity.x) * 0.02;
					}

					if (bunny.velocity.x < 0 && bunny.velocity.x < bunny.velocity.limitsX.min) bunny.velocity.x = bunny.velocity.limitsX.min;
					if (bunny.velocity.x > 0 && bunny.velocity.x > bunny.velocity.limitsX.max) bunny.velocity.x = bunny.velocity.limitsX.max;
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

		scene.assets.push(bunny);

		var pewpew = new PIXI.Sprite.fromImage("images/pewpew_green.png");

			pewpew.anchor.x = 0;
			pewpew.anchor.y = 0.5;

			pewpew.scale.x = 20; /*0.8 + Math.random() * 0.3;*/
			pewpew.scale.y = 1;

			pewpew.position.x = bunny.position.x - (bunny.width / 2);
			pewpew.position.y = bunny.position.y + 5;

			pewpew.blendMode = PIXI.blendModes.ADD;

			pewpew.direction = Math.random() * Math.PI * 2;

			pewpew.settings = {
				tick: 0
			};

			pewpew.update = function() {
				pewpew.position.x = bunny.position.x - (bunny.width / 2);
				pewpew.position.y = bunny.position.y + 5;

				pewpew.settings.tick++;

				if (bunny.isPewpew) {
					console.log('pew!');
					var pos1 = new PIXI.Point(bunny.position.x - (bunny.width / 2), bunny.position.y + 5);
					var pos2 = new PIXI.Point(scene.width, Math.random() * scene.height + 20);

					distX = pos1.x - pos2.x;
					distY = pos1.y - pos2.y;

					var dist = Math.sqrt(distX * distY + distY * distY) + 40;
					pewpew.scale.x = dist / 20;
				}

				if (pewpew.settings.tick > 200 * 0.3) {
					pewpew.alpha *= 0.9;
					pewpew.scale.y = pewpew.alpha;
				}

				if (pewpew.alpha <= 0.09) {
					pewpew.reset();
				}

				console.log(pewpew.alpha, pewpew.settings.tick);
			}

			pewpew.reset = function() {
				bunny.isPewpew = false;
				pewpew.alpha = 1;
				pewpew.scale.y = 1;
				pewpew.settings.tick = 0;				
			}

		// scene.assets.push(pewpew);

	}




	var game = new Game();
		game.init({width: 800, height: 300});

})();





