var GAME_WIDTH = 720;
var GAME_HEIGHT = 480;
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '')

var Player = function (state) {
  this.gameState = state;
  this.game = state.game;
  Phaser.Sprite.call(this, this.game, GAME_WIDTH/2, GAME_HEIGHT-20, 'player');
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
  this.body.velocity.x = 0;

  if(this.game.input.activePointer.isDown){
    if(this.game.input.x < this.x-5){
      this.moveLeft();
    } else if (this.game.input.x > this.x+5){
      this.moveRight();
    }
  } else {
    if(this.cursors.left.isDown){
      this.moveLeft();
    }
    if(this.cursors.right.isDown){
      this.moveRight();
    }
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
    this.game.load.image('player', 'assets/circle.png');
  },
  create: function(){
    this.game.input.maxPointers = 1;

    this.scale.pageAlignHorizontally = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.player = new Player(this);
  },
  update: function(){
    if(this.game.input.activePointer.isDown){
      this.game.state.start('gameOver', true, false, {});
    }
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
