var GAME_WIDTH = 720;
var GAME_HEIGHT = 480;
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '')

var Player = function (state) {
  this.gameState = state;
  this.game = state.game;
  Phaser.Sprite.call(this, this.game, GAME_WIDTH/2, GAME_HEIGHT/2, 'player');
  this.game.add.existing(this);
  this.game.physics.arcade.enable(this);
  this.anchor.setTo(0.5, 0.5);
  this.body.collideWorldBounds = true;
  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.moveSpeed = 250;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
  this.body.velocity.y = this.moveSpeed;
  if(this.game.input.activePointer.isDown){
    this.body.velocity.y = -this.moveSpeed;
    this.frame = 0;
  } else {
    this.frame = 1;
  }
}

Player.prototype.moveLeft = function(){
  if(this.body.x > 0){
    this.body.velocity.x -= this.moveSpeed;
  }
}

Player.prototype.moveRight = function(){
  if(this.body.x < GAME_WIDTH-this.body.width) {
    this.body.velocity.x += this.moveSpeed;
  }
}

function Main() {};

Main.prototype = {
  preload: function(){
    this.game.stage.backgroundColor = '#71c5cf';
    this.game.load.spritesheet('player', 'assets/flyingPersonSprite.png', 32, 60);
    this.game.load.image('ceiling', 'assets/greenBar.png');
    this.game.load.image('floor', 'assets/greenBar.png');
    this.game.load.image('obstacle', 'assets/greenVertical.png');
  },
  create: function(){
    this.score = 0;
    this.game.input.maxPointers = 1;
    this.floor = this.game.add.sprite(0, GAME_HEIGHT-40, 'floor');
    this.ceiling = this.game.add.sprite(0, 0, 'ceiling');

    this.game.physics.arcade.enable(this.floor);
    this.game.physics.arcade.enable(this.ceiling);

    this.scale.pageAlignHorizontally = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.obstacles = this.game.add.group();
    this.obstacles.enableBody = true;
    this.obstacles.createMultiple(100, 'obstacle')

    this.scoreText = this.game.add.text(20, GAME_HEIGHT-30, "Distance: 0")

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.events.loop(1200, this.addObstacle, this);
    this.player = new Player(this);
  },
  update: function(){
    this.score += 1;
    this.scoreText.text = "Distance: " + this.score;
    this.game.physics.arcade.overlap(this.player, this.floor, this.collide, null, this);
    this.game.physics.arcade.overlap(this.player, this.ceiling, this.collide, null, this);
    this.game.physics.arcade.overlap(this.player, this.obstacles, this.collide, null, this);
  },
  collide: function() {
    this.game.state.start('gameOver');
  },
  addObstacle: function(){
    var obstacle = this.obstacles.getFirstDead();
    var yCoordinate = this.game.rnd.between(0, 5) * 80;
    obstacle.reset(GAME_WIDTH, yCoordinate);
    obstacle.body.velocity.x = -250;
    obstacle.checkWorldBounds = true;
    obstacle.outOfBoundKill = true;
  }
};

function GameOver(){};

GameOver.prototype = {
  init: function(params){
  },
  preload: function(){
  },
  create: function(){
    this.game.add.text("275", "100", "Game Over", {font: "32px Arial", fill: "#FFF"});
  },
  update: function(){
  }
}

game.state.add('gameOver', GameOver);
game.state.add('main', Main);
game.state.start('main');
