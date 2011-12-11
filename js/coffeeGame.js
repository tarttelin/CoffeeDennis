(function() {
  var Ambulance, BeachBall, Bouncy, DennisBike, FPS, GameLoop, House, Spider, Sprite, Tree, Vector, Zebedee;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  FPS = 20;
  GameLoop = (function() {
    function GameLoop(canvas) {
      this.canvas = canvas;
      this.drawRoads = __bind(this.drawRoads, this);
      this.draw = __bind(this.draw, this);
      this.bindKeys = __bind(this.bindKeys, this);
      this.clear = __bind(this.clear, this);
      this.createLevels = __bind(this.createLevels, this);
      this.gameOver = __bind(this.gameOver, this);
      this.drawLevel = __bind(this.drawLevel, this);
      this.level3 = __bind(this.level3, this);
      this.level2 = __bind(this.level2, this);
      this.level1 = __bind(this.level1, this);
      this.buffer = document.createElement('canvas');
      this.buffer.width = this.canvas.width;
      this.buffer.height = this.canvas.height;
      this.backBuffer = this.buffer.getContext('2d');
      this.context2D = this.canvas.getContext('2d');
      this.bindKeys();
      this.backBuffer.width = this.canvas.width;
      this.backBuffer.height = this.canvas.height;
      this.createLevels([this.level1, this.level2, this.level3], 0);
    }
    GameLoop.prototype.level1 = function() {
      this.drawRoads(this.backBuffer, '#0F0');
      return this.sprites = [new DennisBike(0, 100), new House(300, 100), new Ambulance(0, 200), new Spider(400, 400)];
    };
    GameLoop.prototype.level2 = function() {
      this.drawRoads(this.backBuffer, '#FFF');
      return this.sprites = [new DennisBike(0, 100), new House(300, 100), new House(100, 300), new Ambulance(0, 200), new Spider(400, 400)];
    };
    GameLoop.prototype.level3 = function() {
      this.drawRoads(this.backBuffer, '#00F');
      return this.sprites = [new DennisBike(0, 100), new House(300, 100), new BeachBall(100, 300), new Ambulance(0, 200), new Spider(400, 400)];
    };
    GameLoop.prototype.drawLevel = function(level, callback) {
      this.clear();
      this.backBuffer.strokeStyle = '#00AA00';
      this.backBuffer.font = '40px san-serif';
      this.backBuffer.textBaseline = 'bottom';
      this.backBuffer.textAlign = 'center';
      this.backBuffer.strokeText("Level " + level, this.backBuffer.width / 2, 200);
      this.context2D.drawImage(this.buffer, 0, 0);
      return setTimeout(callback, 2000);
    };
    GameLoop.prototype.gameOver = function() {
      clearInterval(this.interval);
      this.clear();
      this.backBuffer.strokeStyle = '#00AA00';
      this.backBuffer.font = '40px san-serif';
      this.backBuffer.textBaseline = 'bottom';
      this.backBuffer.textAlign = 'center';
      this.backBuffer.strokeText("Game Complete", this.backBuffer.width / 2, 200);
      return this.context2D.drawImage(this.buffer, 0, 0);
    };
    GameLoop.prototype.createLevels = function(levels, idx) {
      this.clear();
      clearInterval(this.interval);
      return this.drawLevel(idx + 1, __bind(function() {
        this.clear();
        levels[idx]();
        this.playerSprite = this.sprites[0];
        this.interval = setInterval(this.draw, 1000 / FPS);
        this.playerSprite.nextLevel = __bind(function() {
          if (levels.length > idx + 1) {
            return this.createLevels(levels, idx + 1);
          } else {
            return this.gameOver();
          }
        }, this);
        return this.playerSprite.restartLevel = __bind(function() {
          return this.createLevels(levels, idx);
        }, this);
      }, this));
    };
    GameLoop.prototype.clear = function() {
      this.backBuffer.fillStyle = '000';
      return this.backBuffer.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };
    GameLoop.prototype.bindKeys = function() {
      var keyDown;
      keyDown = __bind(function(evt) {
        switch (evt.which) {
          case 37:
            return this.playerSprite.stop();
          case 38:
            return this.playerSprite.jump();
          case 39:
            return this.playerSprite.forward();
        }
      }, this);
      return window.addEventListener('keydown', keyDown, false);
    };
    GameLoop.prototype.draw = function() {
      var sprite, _i, _len, _ref;
      _ref = this.sprites;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        if (sprite.collideWith(this.sprites)) {
          return;
        }
        if (sprite.draw(this.backBuffer)) {
          return;
        }
      }
      return this.context2D.drawImage(this.buffer, 0, 0);
    };
    GameLoop.prototype.drawRoads = function(surface, color) {
      var y, _results;
      surface.fillStyle = color;
      _results = [];
      for (y = 100; y <= 400; y += 100) {
        _results.push(surface.fillRect(0, y, this.canvas.width, 5));
      }
      return _results;
    };
    return GameLoop;
  })();
  Sprite = (function() {
    function Sprite(x, y) {
      this.x = x;
      this.y = y;
      this.collideWith = __bind(this.collideWith, this);
      this.clearAndMove = __bind(this.clearAndMove, this);
      this.hit = __bind(this.hit, this);
      this.draw = __bind(this.draw, this);
      this.move = __bind(this.move, this);
      this.currentVector = new Vector(0, 0);
      this.width = this.height = 0;
    }
    Sprite.prototype.move = function(vector) {
      return this.currentVector = this.currentVector.move(vector);
    };
    Sprite.prototype.draw = function(surface) {};
    Sprite.prototype.hit = function(sprite) {};
    Sprite.prototype.clearAndMove = function(surface) {
      surface.fillStyle = '000';
      surface.fillRect(this.x, this.y, this.width, this.height);
      this.x += this.currentVector.x;
      return this.y += this.currentVector.y;
    };
    Sprite.prototype.collideWith = function(sprites) {
      var collisions, isColliding, sprite;
      isColliding = __bind(function(sprite) {
        return sprite.x < this.x + this.width && sprite.x + sprite.width > this.x && sprite.y < this.y + this.height && sprite.y + sprite.height > this.y;
      }, this);
      collisions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = sprites.length; _i < _len; _i++) {
          sprite = sprites[_i];
          if (sprite !== this && isColliding(sprite)) {
            _results.push(sprite);
          }
        }
        return _results;
      }).call(this);
      if (collisions.length > 0) {
        return this.hit(collisions[0]);
      }
    };
    return Sprite;
  })();
  Vector = (function() {
    function Vector(x, y) {
      this.x = x;
      this.y = y;
      this.move = __bind(this.move, this);
    }
    Vector.prototype.move = function(position) {
      return new Vector(position.x + this.x, position.y + this.y);
    };
    return Vector;
  })();
  House = (function() {
    __extends(House, Sprite);
    function House(x, y) {
      this.draw = __bind(this.draw, this);      House.__super__.constructor.call(this, x, y - 46);
      this.height = 46;
      this.width = 40;
    }
    House.prototype.draw = function(surface) {
      surface.fillStyle = 'white';
      surface.fillRect(this.x, this.y + 20, 40, 26);
      surface.fillStyle = 'black';
      surface.fillRect(this.x + 3, this.y + 22, 10, 6);
      surface.fillStyle = 'blue';
      surface.fillRect(this.x + 3, this.y + 30, 10, 16);
      surface.fillStyle = '#0F0';
      surface.fillRect(this.x + 18, this.y + 22, 18, 14);
      surface.fillStyle = 'black';
      surface.fillRect(this.x + 22, this.y + 22, 10, 14);
      surface.fillStyle = 'white';
      surface.fillRect(this.x + 18, this.y + 28, 18, 2);
      surface.fillStyle = 'red';
      surface.fillRect(this.x, this.y + 16, 40, 4);
      surface.fillRect(this.x + 4, this.y + 12, 32, 4);
      surface.fillRect(this.x + 8, this.y + 8, 24, 4);
      surface.fillRect(this.x + 12, this.y + 4, 16, 4);
      surface.fillRect(this.x + 16, this.y, 8, 4);
      surface.fillStyle = 'white';
      return surface.fillRect(this.x + 32, this.y + 6, 3, 6);
    };
    return House;
  })();
  DennisBike = (function() {
    __extends(DennisBike, Sprite);
    function DennisBike(x, y) {
      this.drawDennis = __bind(this.drawDennis, this);
      this.draw = __bind(this.draw, this);
      this.hit = __bind(this.hit, this);
      this.doJump = __bind(this.doJump, this);
      this.jump = __bind(this.jump, this);
      this.stop = __bind(this.stop, this);
      this.forward = __bind(this.forward, this);      DennisBike.__super__.constructor.call(this, x, y - 33);
      this.height = 33;
      this.width = 24;
      this.jumpMovement = [-5, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, -5];
    }
    DennisBike.prototype.forward = function() {
      return this.move(new Vector(1, 0));
    };
    DennisBike.prototype.stop = function() {
      return this.currentVector = new Vector(0, this.currentVector.y);
    };
    DennisBike.prototype.jump = function() {
      var _ref;
      if (!((_ref = this.jumpInProgress) != null ? _ref.length : void 0) > 0) {
        this.jumpInProgress = this.jumpMovement.slice();
      }
      return this.jumping = true;
    };
    DennisBike.prototype.doJump = function() {
      var _ref;
      this.jumping = ((_ref = this.jumpInProgress) != null ? _ref.length : void 0) > 0;
      if (this.jumping) {
        return this.move(new Vector(0, this.jumpInProgress.pop()));
      }
    };
    DennisBike.prototype.hit = function(otherSprite) {
      alert("Crash");
      this.restartLevel();
      return true;
    };
    DennisBike.prototype.draw = function(surface) {
      var _ref;
      this.clearAndMove(surface);
      if ((_ref = this.jumping) != null ? _ref : this.jumping = true) {
        this.doJump();
      }
      if (this.x >= surface.width) {
        this.x = 0;
        this.y += 100;
      }
      if (this.y > surface.height) {
        this.nextLevel();
        return true;
      } else {
        return this.drawDennis(surface);
      }
    };
    DennisBike.prototype.drawDennis = function(surface) {
      surface.fillStyle = 'red';
      surface.fillRect(this.x, this.y, 10, 10);
      surface.fillRect(this.x + 10, this.y, 5, 3);
      surface.fillStyle = '#00F';
      surface.fillRect(this.x + 11, this.y + 3, 3, 3);
      surface.fillStyle = 'purple';
      surface.fillRect(this.x + 10, this.y + 3, 1, 7);
      surface.fillRect(this.x + 11, this.y + 6, 7, 4);
      surface.fillStyle = '#0F0';
      surface.fillRect(this.x + 4, this.y + 10, 10, 15);
      surface.fillStyle = 'white';
      surface.fillRect(this.x, this.y + 25, 8, 8);
      surface.fillRect(this.x + 14, this.y + 25, 8, 8);
      surface.fillStyle = 'black';
      surface.fillRect(this.x + 2, this.y + 27, 4, 4);
      surface.fillRect(this.x + 16, this.y + 27, 4, 4);
      surface.fillStyle = 'white';
      surface.fillRect(this.x + 17, this.y + 18, 2, 7);
      surface.fillStyle = '#00F';
      surface.fillRect(this.x + 17, this.y + 16, 2, 2);
      surface.fillStyle = 'yellow';
      surface.fillRect(this.x + 6, this.y + 16, 11, 2);
      surface.fillRect(this.x + 15, this.y + 15, 4, 1);
      surface.fillStyle = '#0F0';
      surface.fillRect(this.x, this.y + 25, 18, 2);
      surface.fillStyle = 'red';
      return surface.fillRect(this.x + 12, this.y + 27, 6, 4);
    };
    return DennisBike;
  })();
  Ambulance = (function() {
    __extends(Ambulance, Sprite);
    function Ambulance(x, y) {
      this.draw = __bind(this.draw, this);      Ambulance.__super__.constructor.call(this, x, y - 28);
      this.height = 28;
      this.width = 28;
      this.move(new Vector(5, 0));
    }
    Ambulance.prototype.draw = function(surface) {
      this.clearAndMove(surface);
      if (this.x > surface.width) {
        this.x = 0;
      }
      surface.fillStyle = 'blue';
      surface.fillRect(this.x + 10, this.y, 10, 2);
      surface.fillStyle = 'white';
      surface.fillRect(this.x, this.y + 2, 20, 20);
      surface.fillRect(this.x + 20, this.y + 5, 8, 1);
      surface.fillRect(this.x + 20, this.y + 18, 8, 2);
      surface.fillRect(this.x, this.y + 20, 8, 8);
      surface.fillRect(this.x + 18, this.y + 20, 8, 8);
      surface.fillStyle = 'black';
      surface.fillRect(this.x + 2, this.y + 22, 4, 4);
      surface.fillRect(this.x + 20, this.y + 22, 4, 4);
      surface.fillStyle = 'cyan';
      surface.fillRect(this.x, this.y + 20, 28, 2);
      surface.fillRect(this.x + 20, this.y + 6, 8, 12);
      surface.fillStyle = 'red';
      surface.fillRect(this.x + 8, this.y + 4, 4, 12);
      return surface.fillRect(this.x + 4, this.y + 8, 12, 4);
    };
    return Ambulance;
  })();
  Spider = (function() {
    __extends(Spider, Sprite);
    function Spider(x, y) {
      this.draw = __bind(this.draw, this);      Spider.__super__.constructor.call(this, x, y - 95);
      this.width = 30;
      this.height = 40;
      this.heightMovement = 2;
    }
    Spider.prototype.draw = function(surface) {
      this.clearAndMove(surface);
      this.height += this.heightMovement;
      if (this.height > 80 || this.height < 40) {
        this.heightMovement *= -1;
      }
      surface.fillStyle = 'yellow';
      surface.fillRect(this.x + 13, this.y, 4, this.height - 25);
      surface.fillStyle = 'F00';
      surface.fillRect(this.x, this.y + this.height - 25, 30, 20);
      surface.fillStyle = 'cyan';
      surface.fillRect(this.x, this.y + this.height - 4, 4, 4);
      surface.fillRect(this.x + 9, this.y + this.height - 4, 4, 4);
      surface.fillRect(this.x + 18, this.y + this.height - 4, 4, 4);
      surface.fillRect(this.x + 26, this.y + this.height - 4, 4, 4);
      surface.fillStyle = '000';
      surface.fillRect(this.x + 4, this.y + this.height - 21, 4, 4);
      return surface.fillRect(this.x + 22, this.y + this.height - 21, 4, 4);
    };
    return Spider;
  })();
  Bouncy = (function() {
    __extends(Bouncy, Sprite);
    function Bouncy(x, y) {
      this.draw = __bind(this.draw, this);      Bouncy.__super__.constructor.call(this, x, y);
      this.bounce = [-5, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, -5];
      this.idx = 0;
    }
    Bouncy.prototype.draw = function(surface) {
      this.move(new Vector(0, this.bounce[this.idx++]));
      if (this.idx === this.bounce.length) {
        this.idx = 0;
      }
      return this.clearAndMove(surface);
    };
    return Bouncy;
  })();
  BeachBall = (function() {
    __extends(BeachBall, Bouncy);
    function BeachBall(x, y) {
      this.draw = __bind(this.draw, this);      BeachBall.__super__.constructor.call(this, x, y - 20);
      this.width = this.height = 20;
    }
    BeachBall.prototype.draw = function(surface) {
      BeachBall.__super__.draw.call(this, surface);
      surface.beginPath();
      surface.arc(this.x + 10, this.y + 10, 10, 0, 2 * Math.PI, false);
      surface.fillStyle = 'F00';
      return surface.fill();
    };
    return BeachBall;
  })();
  Zebedee = (function() {
    __extends(Zebedee, Bouncy);
    function Zebedee(x, y) {
      this.draw = __bind(this.draw, this);      Zebedee.__super__.constructor.call(this, x, y - 20);
      this.width = this.height = 20;
    }
    Zebedee.prototype.draw = function(surface) {
      Zebedee.__super__.draw.call(this, surface);
      surface.beginPath();
      surface.arc(this.x + 10, this.y + 10, 10, 0, 2 * Math.PI, false);
      surface.fillStyle = 'F00';
      return surface.fill();
    };
    return Zebedee;
  })();
  Tree = (function() {
    __extends(Tree, Sprite);
    function Tree(x, y) {
      this.draw = __bind(this.draw, this);      Tree.__super__.constructor.call(this, x, y);
    }
    Tree.prototype.draw = function(surface) {};
    return Tree;
  })();
  window.GameLoop = GameLoop;
}).call(this);
