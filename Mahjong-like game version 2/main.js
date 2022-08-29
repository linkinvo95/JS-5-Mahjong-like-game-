var myCards = document.getElementById("container");
var resultsArray = [];
var counter = 00;
var text = document.getElementById("text");
var seconds = 00;
var tens = 00;
var tries = 00;
var appendTens = document.getElementById("tens");
var appendSeconds = document.getElementById("seconds");
var buttonPause = document.getElementById("button-pause");

var Interval;
var numbers = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

var clone = numbers.slice(0); // duplicate array
var cards = numbers.concat(clone); // merge to arrays

// Shufffel function
function shuffle(o) {
  for (
    var j, x, i = o.length;
    i;
    j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}
shuffle(cards);

for (var i = 0; i < cards.length; i++) {
  card = document.createElement("div");
  card.dataset.item = cards[i];
  card.dataset.view = "card";
  myCards.appendChild(card);

  card.onclick = function () {
    if (this.className != "flipped" && this.className != "correct") {
      this.className = "flipped";
      var result = this.dataset.item;
      resultsArray.push(result);
      clearInterval(Interval);
      Interval = setInterval(startTimer, 10);
    }

    if (resultsArray.length > 1) {
      if (resultsArray[0] === resultsArray[1]) {
        check("correct");
        counter++;
        win();
        resultsArray = [];
      } else {
        check("reverse");
        resultsArray = [];
      }
    }
  };
}

window.onload = function () {
  span = document.getElementById("triesid");
  var tries = 00;
  span.innerHTML = tries;
  document.body.onclick = function (e) {
    e = e || event;
    var target = e.target || e.srcElement;
    if (target.className != "flipped") return;
    tries++;
    span.innerHTML = Math.floor(tries / 2);
  };
};

var check = function (className) {
  var x = document.getElementsByClassName("flipped");

  setTimeout(function () {
    for (var i = x.length - 1; i >= 0; i--) {
      x[i].className = className;
    }
  }, 500);
};

var win = function () {
  if (counter === 15) {
    clearInterval(Interval);
    a.run();
  }
};

buttonPause.onclick = function () {
  clearInterval(Interval);
};

function startTimer() {
  tens++;

  if (tens < 9) {
    appendTens.innerHTML = "0" + tens;
  }

  if (tens > 9) {
    appendTens.innerHTML = tens;
  }

  if (tens > 99) {
    seconds++;
    appendSeconds.innerHTML = "0" + seconds;
    tens = 0;
    appendTens.innerHTML = "0" + 0;
  }

  if (seconds > 9) {
    appendSeconds.innerHTML = seconds;
  }
}




const rndColor = () => {
    const base  = Math.random() * 360 | 0;
    const color = (275 * (base / 200 | 0)) + base % 200;
    return fac => `hsl(${color}, ${(fac || 1) * 100}%, ${(fac || 1) * 60}%)`;
};

class Battery
{
    constructor(fireworks) {
        this.fireworks = fireworks;
        this.salve = [];
        this.x     = Math.random();
        this.t     = 0;
        this.tmod  = 20 + Math.random() * 20 | 0;
        this.tmax  = 500 + Math.random() * 1000;

        this._shot = salve => {
            // console.log(this.x * this.fireworks.width, salve.y);
            if (salve.y < salve.ym) {
                salve.cb = this._prepareExplosion;
            }

            salve.x += salve.mx;
            salve.y -= 0.01;

            const r = Math.atan2(-0.01, salve.mx);

            this.fireworks.engine.strokeStyle = salve.c(.7);
            this.fireworks.engine.beginPath();

            this.fireworks.engine.moveTo(
                (this.x + salve.x) * this.fireworks.width + Math.cos(r) * 4,
                salve.y * this.fireworks.height + Math.sin(r) * 4
            );

            this.fireworks.engine.lineTo(
                (this.x + salve.x) * this.fireworks.width + Math.cos(r + Math.PI) * 4,
                salve.y * this.fireworks.height + Math.sin(r + Math.PI) * 4
            );

            this.fireworks.engine.lineWidth = 3;
            this.fireworks.engine.stroke();
        };

        this._prepareExplosion = salve => {
            salve.explosion = [];

            for (let i = 0, max = 32; i < max; i++) {
                salve.explosion.push({
                    r : 2 * i / Math.PI,
                    s : 0.5 + Math.random() * 0.5,
                    d : 0,
                    y : 0
                });
            }

            salve.cb = this._explode;
        };

        this._explode = salve => {

            this.fireworks.engine.fillStyle = salve.c();

            salve.explosion.forEach(explo => {

                explo.d += explo.s;
                explo.s *= 0.99;
                explo.y += 0.5;

                const alpha = explo.s * 2.5;
                this.fireworks.engine.globalAlpha = alpha;

                if (alpha < 0.05) {
                    salve.cb = null;
                }

                this.fireworks.engine.fillRect(
                    Math.cos(explo.r) * explo.d + (this.x + salve.x) * this.fireworks.width,
                    Math.sin(explo.r) * explo.d + explo.y + salve.y * this.fireworks.height,
                    3,
                    3
                );
            });

            this.fireworks.engine.globalAlpha = 1;
        }
    }

    pushSalve() {
        this.salve.push({
            x: 0,
            mx: -0.02 * Math.random() * 0.04,
            y: 1,
            ym: 0.05 + Math.random() * 0.5,
            c: rndColor(),
            cb: this._shot
        });
    };

    render() {

        this.t++;

        if (this.t < this.tmax && (this.t % this.tmod) === 0) {
            this.pushSalve();
        }

        let rendered = false;

        this.salve.forEach(salve => {

            if (salve.cb) {
                rendered = true;
                salve.cb(salve);
            }

        });

        if (this.t > this.tmax) {
            return rendered;
        }

        return true;
    }
}

class Fireworks
{
    constructor() {
        this.canvas = window.document.querySelector('canvas');
        this.engine = this.canvas.getContext('2d');
        this.stacks = new Map();

        this.resize();
    }

    resize() {
        this.width  = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
    }

    clear() {
        this.engine.clearRect(0, 0, this.width, this.height);
        this.engine.fillStyle = '#222';
        this.engine.fillRect(0, 0, this.width, this.height);
    }

    addBattery() {
      const bat = new Battery(this);
      this.stacks.set(Date.now(), bat);  
    }
  
    render() {

        if (Math.random() < 0.05) {
          this.addBattery();
        }
      
        this.clear();

        this.stacks.forEach((scene, key) => {

            const rendered = scene.render();

            if (!rendered) {
                this.stacks.delete(key);
            }
        });

        requestAnimationFrame(this.render.bind(this));
    }

    run() {
        for(let i = 0; i < 5; i++) {
          this.addBattery();
        }
        window.addEventListener('resize', this.resize.bind(this));
        this.render();
    }
}

a = new Fireworks();