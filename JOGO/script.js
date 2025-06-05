// Carregando Canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Imagens
nave = new Image();
nave.src = "nave1.png";

naveDano = new Image();
naveDano.src = "naveDano.png";

naveDestruida = new Image();
naveDestruida.src = "naveDestruida.png";

fundo = new Image();
fundo.src = "fundo2.jpg";

tiro = new Image();
tiro.src = "tiro.png";

asteroide = new Image();
asteroide.src = "asteroide1.png";

asteroideDano1 = new Image();
asteroideDano1.src = "asteroide2.png";

asteroideDano2 = new Image();
asteroideDano2.src = "asteroide3.png";

asteroideDestruido = new Image();
asteroideDestruido.src = "asteroide4.png";

coracao = new Image();
coracao.src = "vida1.png";

coracao2 = new Image();
coracao2.src = "vida2.png";

coracao3 = new Image();
coracao3.src = "vida4.png";

coracao4 = new Image();
coracao4.src = "vida6.png";

coracao5 = new Image();
coracao5.src = "vida5.png";

// Background
let background = {
  y: 0,
  w: canvas.width,
  h: canvas.height,
  s: 2,
};

// Jogador
let jogadorEmColisao = false;
let jogadorDanoTimer = 0;
let keys = [];
let jogador = {
  x: 333,
  y: 550,
  s: 8,
  w: 130,
  h: 130,
  v: 10,
  p: 0,
  img: nave,
};

// Asteroides
let maxAsteroides = 5;
let asteroides = [];

// Jogo
let estadoDoJogo = "ínicio";
let jogoTravado = false;
let contTeclaEsc = false;

setInterval(() => {
  if (asteroides.length < maxAsteroides) {
    let novoAsteroide = {
      w: 130,
      h: 130,
      x: Math.random() * (canvas.width - 130),
      y: -130,
      v: 3,
      s: 6,
      img: asteroide,
      destruido: false,
      opacity: 1,
    };

    asteroides.push(novoAsteroide);
  }
}, 1500);

// Tiro
let tW = 65;
let tH = 65;
let tiros = [];
let tSpeed = 7;
let atirando = false;
let podeAtirar = true;

function desenhaTextos() {
  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P', system-ui";
  ctx.textAlign = "center";

  if (estadoDoJogo === "jogando") {
    ctx.font = "40px 'Press Start 2P', system-ui";
    ctx.fillStyle = "white";
    ctx.fillText(jogador.p, canvas.width / 2, 80);

    if (jogador.v >= 8) {
      ctx.drawImage(coracao, canvas.width / 2 + 205, -40, 231, 230);
    } else if (jogador.v < 8 && jogador.v >= 5) {
      ctx.drawImage(coracao2, canvas.width / 2 + 205, -40, 231, 230);
    } else if (jogador.v < 5 && jogador.v >= 3) {
      ctx.drawImage(coracao3, canvas.width / 2 + 205, -40, 231, 230);
    } else if (jogador.v >= 1) {
      ctx.drawImage(coracao4, canvas.width / 2 + 205, -40, 231, 230);
    }

    ctx.font = "25px 'Press Start 2P', system-ui";
    ctx.fillStyle = "white";
    ctx.fillText(jogador.v, canvas.width / 2 + 320, 80);
  }

  if (estadoDoJogo === "ínicio") {
    ctx.fillText(
      "Pressione a tecla ENTER para jogar!",
      canvas.width / 2,
      canvas.height / 2
    );

    ctx.font = "15px 'Press Start 2P', system-ui";
    ctx.fillText("Controles:", canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText(
      "Setas para Movimentar",
      canvas.width / 2,
      canvas.height / 2 + 80
    );
    ctx.fillText(
      "Espaço para Atirar",
      canvas.width / 2,
      canvas.height / 2 + 100
    );
    ctx.fillText("ESC para Pausar", canvas.width / 2, canvas.height / 2 + 120);
    ctx.font = "40px 'Press Start 2P', system-ui";
    ctx.fillText("Asteroid Shooter", canvas.width / 2, canvas.height / 2 - 300);
  }

  if (estadoDoJogo === "gameover") {
    ctx.drawImage(
      coracao5,
      canvas.width / 2 - 100,
      canvas.height / 2,
      231,
      230
    );

    ctx.fillText(jogador.v, canvas.width / 2 + 17, canvas.height / 2 + 118);
    ctx.fillStyle = "red";
    ctx.fillText("Você perdeu!", canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "white";
    ctx.fillText(
      "Pressione ENTER para reiniciar!",
      canvas.width / 2,
      canvas.height / 2 + 40
    );

    ctx.font = "15px 'Press Start 2P', system-ui";
    ctx.fillText(
      "M para voltar ao MENU",
      canvas.width / 2,
      canvas.height / 2 + 198
    );
    ctx.fillText(
      "R para REINICIAR o Jogo",
      canvas.width / 2,
      canvas.height / 2 + 218
    );
  }

  if (estadoDoJogo === "pausado") {
    ctx.fillStyle = "red";
    ctx.fillText("Jogo Pausado!", canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "white";
    ctx.fillText(
      "Pressione ESC para voltar a jogar!",
      canvas.width / 2,
      canvas.height / 2 + 40
    );

    ctx.font = "15px 'Press Start 2P', system-ui";
    ctx.fillText(
      "M para voltar ao MENU",
      canvas.width / 2,
      canvas.height / 2 + 80
    );
    ctx.fillText(
      "R para REINICIAR o Jogo",
      canvas.width / 2,
      canvas.height / 2 + 100
    );
  }
}

function desenhaBackground() {
  background.y += background.s;

  if (background.y >= background.h) {
    background.y -= background.h;
  }

  ctx.drawImage(fundo, 0, background.y, background.w, background.h);
  ctx.drawImage(
    fundo,
    0,
    background.y - background.h,
    background.w,
    background.h
  );
}

function desenhaJogador() {
  ctx.drawImage(jogador.img, jogador.x, jogador.y, jogador.w, jogador.h);
}

function moverJogador() {
  if (jogador.v <= 0) return false;

  if (keys["ArrowUp"] && jogador.y > 0) {
    jogador.y -= jogador.s;
  }
  if (keys["ArrowDown"] && jogador.y < background.h - jogador.h) {
    jogador.y += jogador.s;
  }
  if (keys["ArrowLeft"] && jogador.x > 0) {
    jogador.x -= jogador.s;
  }
  if (keys["ArrowRight"] && jogador.x < background.w - jogador.w) {
    jogador.x += jogador.s;
  }

  ctx.restore();
}

function desenhaAsteroide() {
  if (estadoDoJogo === "gameover") return false;

  for (let i = 0; i < asteroides.length; i++) {
    let asteroideAtual = asteroides[i];

    if (asteroideAtual.destruido) {
      asteroideAtual.opacity -= 0.02;
    }

    if (asteroideAtual.opacity <= 0) {
      asteroideAtual.opacity = 0;
      asteroides.splice(i, 1);
    }

    ctx.globalAlpha = asteroideAtual.opacity;

    ctx.drawImage(
      asteroideAtual.img,
      asteroideAtual.x,
      asteroideAtual.y,
      asteroideAtual.w,
      asteroideAtual.h
    );

    if (!asteroideAtual.destruido) {
      asteroideAtual.y += asteroideAtual.s;
    }

    if (asteroideAtual.y > 700) {
      asteroides.splice(i, 1);
    }
  }
  
  ctx.globalAlpha = 1;
}

function desenhaTiro() {
  for (let i = 0; i < tiros.length; i++) {
    let tiroAtual = tiros[i];
    ctx.drawImage(tiro, tiroAtual.x, tiroAtual.y, tiroAtual.w, tiroAtual.h);
    tiroAtual.y -= tSpeed;

    if (tiroAtual.y < 0) {
      tiros.splice(i, 1);
    }
  }

}

function colisao(tiro, asteroide) {
  if (asteroide.destruido) return false;

  return (
    tiro.x + 30 < asteroide.x + asteroide.w &&
    tiro.x + tiro.w - 30 > asteroide.x &&
    tiro.y + 30 < asteroide.y + asteroide.h &&
    tiro.y + tiro.h - 30 > asteroide.y
  );
}

function colisaoAsteroideJogador(jogador, asteroide) {
  if (asteroide.destruido) return false;

  return (
    asteroide.x + 30 < jogador.x + jogador.w &&
    asteroide.x + asteroide.w - 30 > jogador.x &&
    asteroide.y + 30 < jogador.y + jogador.h &&
    asteroide.y + asteroide.h - 30 > jogador.y
  );
}

function verificaColisao() {
  for (let i = 0; i < tiros.length; i++) {
    for (let a = 0; a < asteroides.length; a++) {
      if (colisao(tiros[i], asteroides[a])) {
        tiros.splice(i, 1);
        asteroides[a].v -= 1;

        if (asteroides[a].v == 2) {
          asteroides[a].img = asteroideDano1;
        } else if (asteroides[a].v == 1) {
          asteroides[a].img = asteroideDano2;
        } else if (asteroides[a].v == 0) {
          asteroides[a].img = asteroideDestruido;
          asteroides[a].destruido = true;
          asteroides[a].opacity = 1;
          jogador.p += 100;
        }
        break;
      }
    }
  }
}

function danoEcolisao() {
  let colisaoComJogador = false;

  for (let i = 0; i < asteroides.length; i++) {
    if (colisaoAsteroideJogador(jogador, asteroides[i])) {
      colisaoComJogador = true;

      if (!jogadorEmColisao) {
        jogador.v -= 3;
        jogador.img = naveDano;
        asteroides[i].v -= 3;

        if (asteroides[i].v <= 0) {
          asteroides[i].img = asteroideDestruido;
          asteroides[i].destruido = true;
          asteroides[i].opacity = 1;
        }

        if (jogador.v <= 0) {
          jogador.img = naveDestruida;
          estadoDoJogo = "gameover";
          jogadorEmColisao = true;
          jogador.v = 0;
        }

        jogadorEmColisao = true;
      }
    }
  }

  if (!colisaoComJogador && jogador.v > 0) {
    jogadorEmColisao = false;
    jogador.img = nave;
  }
}

function reiniciarJogo() {
  jogadorEmColisao = false;
  jogador.img = nave;
  estadoDoJogo = "jogando";
  jogoTravado = false;
  jogador.v = 10;
  jogador.x = 350;
  jogador.y = 550;
  tiros = [];
  asteroides = [];
  jogador.p = 0;
}

document.addEventListener("keydown", function (event) {
  keys[event.key] = true;

  if (event.key === " ") {
    atirando = true;
  }
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false;

  if (event.key === " ") {
    atirando = false;
  }
});

function controleTiro() {
  if (atirando && podeAtirar) {
    let novoTiro = {
      x: jogador.x + jogador.w / 2 - tW / 2,
      y: jogador.y - 20,
      w: tW,
      h: tH,
    };
    tiros.push(novoTiro);

    podeAtirar = false;
    setTimeout(() => {
      podeAtirar = true;
    }, 300);
  }
}

function jogar() {
  if (jogoTravado) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (estadoDoJogo === "gameover") {
    desenhaBackground();
    desenhaJogador();
    desenhaTextos();
    desenhaAsteroide();
  }

  if (estadoDoJogo === "ínicio") {
    desenhaBackground();
    desenhaJogador();
    desenhaTextos();
  }

  if (estadoDoJogo === "jogando") {
    desenhaBackground();
    desenhaJogador();
    moverJogador();
    desenhaAsteroide();
    desenhaTiro();
    controleTiro();
    verificaColisao();
    danoEcolisao();
    desenhaTextos();
  }
}

canvas.addEventListener("click", function (event) {
  let rect = canvas.getBoundingClientRect();
  let cX = event.clientX - rect.left;
  let cY = event.clientY - rect.top;
  console.log("x:", cX, "y:", cY);
});

document.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});

document.addEventListener("keyup", function (event) {
  if (estadoDoJogo === "ínicio" && event.key === "Enter") {
    estadoDoJogo = "jogando";
    jogoTravado = false;
  }

  if (estadoDoJogo === "gameover" && event.key === "Enter") {
    reiniciarJogo();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !contTeclaEsc) {
    if (estadoDoJogo === "jogando") {
      estadoDoJogo = "pausado";
      jogoTravado = true;
      desenhaTextos();
      console.log(estadoDoJogo);
    } else if (estadoDoJogo === "pausado") {
      jogoTravado = false;
      estadoDoJogo = "jogando";
    }

    contTeclaEsc = true;
  }
});

document.addEventListener("keydown", function (event) {
  if (estadoDoJogo != "ínicio") {
    if (event.key === "M" || event.key === "m") {
      reiniciarJogo();
      estadoDoJogo = "ínicio";
    }

    if (event.key === "R" || event.key === "r") {
      reiniciarJogo();
    }
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "Escape") {
    contTeclaEsc = false;
  }
});

setInterval(jogar, 1000 / 60);
