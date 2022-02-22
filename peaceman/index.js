const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
console.log("its a mee PeACE MAN");
// Game Object
let game = {
  gameOver: false,
  key: undefined,
  keyPressed: undefined,
  boulderSpawnRate: 3000,
  score: 0,
  // Colour vars
  bloodEffectColours: ["#D22F03", "#C52A05", "#B82506", "#9E1A09", "#960E08", "#8D0207", "#850309", "#7C030B", "#73040D", "#73040D", "#6A040F"],
  // Objects
  player: undefined,
  particles: [],
  boulders: [],
  bombs: []
};

// Player Class
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xWidth = 30;
    this.yWidth = 30;
    this.velocity = {
      x: 0,
      y: 1,
      bounceY: 2
    }
    this.isTouchingGround = false;
    this.power = false;
    this.spriteImg = undefined;
  }
  draw() {
    if (this.power&&!this.isTouchingGround) {
      c.fillStyle="#505000";
    } else {
      this.power = false;
      c.fillStyle="#f00";
    }
    c.fillRect(this.x, this.y, this.xWidth, this.yWidth);
  }
  update() {
    this.draw();
    // Keeping player on screen
    if (this.y>=innerHeight-this.yWidth) {
      this.y = innerHeight - this.yWidth
      this.velocity.y = 0;
      this.isTouchingGround = true;
    } else {
      this.isTouchingGround = false;
    }
    this.velocity.y++;
    if (this.x<=0) {
      this.velocity.x = 0;
      this.x = 0;
    }
    // Friction between ground and Player
    if (this.isTouchingGround) {
      this.velocity.x /= 1.269;
    }
    // WASD Movement
    if (game.keyPressed==119&&this.isTouchingGround) {
      // Bounce UP
      this.velocity.y = -20;
    } else if(game.keyPressed==97) {
      this.velocity.x = -5;
    } else if (game.keyPressed==115&&this.isTouchingGround) {
      //nothing for now
      this.velocity.x = 0;
      this.velocity.y = 0;
    } else if(game.keyPressed==100) {
      this.velocity.x = 5;
    } else if(game.keyPressed==113&&!this.isTouchingGround) {
      this.power = true;
    }
    // Blood Effect
    if (this.power&&this.isTouchingGround) {
      for (var i = 0; i < 150; i++) {
        game.particles.push(new BloodParticle(this.x, this.y))
      }
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}


class Bomb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 7;
    this.velocity = {
      x: undefined,
      y: undefined
    }
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.closePath();
    c.fillStyle="#696969"
    c.fill();
  }
  update() {
    this.draw();
  }
}
// Blood Effect
class BloodParticle {
  constructor(x, y) {
    this.x = x+Math.random()*30;
    this.y = y+Math.random()*30;
    this.radius = Math.random()*12;
    this.colour = game.bloodEffectColours[Math.floor(Math.random()*11)];
    this.velocity = {
      x: Math.sin((Math.random()-0.5)*6),
      y: Math.cos(-(Math.random())*3)
    }
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    c.closePath();
    c.fillStyle = this.colour;
    c.fill();
  }
  update() {
    this.draw();
    //Gravity & stuf goes here
    if(this.y<=innerHeight+this.radius) {
      this.velocity.y += 0.25;
    } else if (this.y+this.radius>innerHeight) {
      this.y = innerHeight;
      this.velocity.y = (-this.velocity.y)/2;
    }
    this.velocity.x = this.velocity.x/1.02
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.radius -= 0.05;
  }
}

// Enemy
class Boulder {
  constructor() {
    this.x = Math.random() * innerWidth;
    this.radius = ((Math.random()+1.5)*70);
    this.dimensions = {
      x: this.radius,
      y: this.radius*1.5
    }
    this.y = -this.dimensions.y;
    this.racism = Math.floor(Math.random()*70);
    this.velocity = {
      x: 0,
      y: 3
    }
    this.spriteImg = new Image();
    this.spriteImg.src = "data:image/jpeg;base64,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"
  }
  draw() {
    c.drawImage(this.spriteImg, this.x, this.y, this.dimensions.x, this.dimensions.y);
  }
  update() {
    this.draw();

    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}

// Init  Function
init();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight)
  game.particles.forEach((bloodParticle, i) => {
    bloodParticle.update();
    if (bloodParticle.radius<=1) {
      game.particles.splice(i, 1)
    }
  });
  //Bouulers
  game.boulders.forEach((boulder, i) => {
    boulder.update();
    if(hitBox(game.player.x, game.player.y, game.player.xWidth, game.player.yWidth, boulder.x, boulder.y, boulder.dimensions.x, boulder.dimensions.y)) {
      game.gameOver = true;
    }
    if(boulder.y - boulder.dimensions.y >= innerHeight) {
      game.boulders.splice(i, 1)
    }
  });
  
  game.player.update(game.boulders);

  // GameOver Code
  if (game.gameOver==true) {
    alert("LOL YOU DIED");
    alert("GET GOOD EZ GG");
    alert("NOOB");
    alert("ONLY "+game.score+" SCORE");
    game.score = 0;
    game.gameOver=false;
    game.boulders.splice(0, game.boulders.length);
  }
}
animate();
