// Constantes para animar
const titulo = document.querySelector(".titulo");
const quest = document.querySelector(".quest");
const button = document.querySelector(".arcade");
const container = document.querySelector(".container");

// Animaciones GSAP
const titleAnimation = gsap.timeline();

titleAnimation.from(titulo, {
  opacity: 0,
  y: -50,
  duration: 1,
  ease: "elastic.out(1, 0.5)",
});

const questAnimation = gsap.timeline();

questAnimation.from(quest, {
  opacity: 0,
  y: -150,
  duration: 1,
  ease: "bounce.out",
  delay: 0.5,
});

const buttonAnimation = gsap.from(button, {
  opacity: 0,
  y: 20,
  duration: 0.5,
  delay: 0.8,
  ease: "back.out(2)",
});

// Efecto bounce boton start
const coinAnimation = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

coinAnimation.to(button, {
  scale: 1.2,
  duration: 0.2,
  ease: "power1.inOut",
});

coinAnimation.to(button, {
  scale: 1,
  duration: 0.2,
  ease: "power1.inOut",
});

// Interacción al botón "START"
const startButton = document.getElementById("startButton");
const soundButton = document.getElementById("soundButton");

soundButton.volume = 0.1;

startButton.addEventListener("click", () => {
  soundButton.play(); // Reproduce el efecto de sonido
  startButton.textContent = "Cargando...";

  setTimeout(() => {
    window.location.href = "./pages/game.html";
  }, 2000);
});

// Audios
const musicButton = document.getElementById("musicButton");
const audio = document.querySelector("audio");

audio.volume = 0.05;
let isMuted = false;
let hasUserInteracted = false;

function toggleMusic() {
  isMuted = !isMuted;

  if (isMuted) {
    audio.pause();
    musicButton.src = "./assets/OFF.png";
  } else {
    audio.play();
    audio.volume = 0.05;
    musicButton.src = "./assets/ON.png";
  }
}

musicButton.addEventListener("click", () => {
  if (!hasUserInteracted) {
    audio.volume = 0.01;
    audio.play();
    hasUserInteracted = true;
  }

  toggleMusic();
});

function loadGamePage() {
  // Mostrar el mensaje de "Cargando..."
  document.getElementById("startButton").style.display = "none";
  document.getElementById("loading").style.display = "block";
  // Volumen de la pagina
  audio.volume = 0.01;

  // Animacion de gsap horizontal
  setTimeout(function () {
    gsap.to(document.body, {
      x: "-100%",
      duration: 1,
      ease: "power2.inOut",
      onComplete: function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "game.html", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            document.body.innerHTML = xhr.responseText;
            gsap.from(document.body, {
              opacity: 0,
              duration: 1,
              onComplete: setupGame,
            });
          }
        };
        xhr.send();
      },
    });
  }, 1000);
}

function setupGame() {}
