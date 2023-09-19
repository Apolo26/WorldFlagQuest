const botonGuardar = document.getElementById("guardar-btn");
const botonHome = document.querySelector(".home-button");

botonGuardar.addEventListener("click", async () => {
  botonGuardar.textContent = "X";
  botonGuardar.style.backgroundColor = "#ff0000";

  gsap.fromTo(
    botonGuardar,
    { scale: 1 },
    {
      scale: 1.2,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power1.out",
      onComplete: async () => {
        botonGuardar.textContent = "GUARDAR";
        botonGuardar.style.backgroundColor = "#FF0000";
        gsap.to(botonGuardar, {
          scale: 1,
          duration: 0.3,
          onComplete: async () => {
            setTimeout(() => {
              botonGuardar.textContent = "GUARDAR";
            }, 4000);
          },
        });
      },
    }
  );
});

// Animación del botón HOME
botonHome.addEventListener("click", (event) => {
  event.preventDefault();
  gsap.to(botonHome, {
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    opacity: 0.1,
    onComplete: () => {
      window.location.href = botonHome.getAttribute("href");
    },
  });
});

// Audios
const musicButton = document.getElementById("musicButton");
const audio = document.querySelector("audio");

let isMuted = false;
let hasUserInteracted = false;

function toggleMusic() {
  isMuted = !isMuted;

  if (isMuted) {
    audio.pause();
    musicButton.src = "../assets/OFF.png";
  } else {
    audio.play();
    audio.volume = 0.1;
    musicButton.src = "../assets/ON.png";
  }
}

// Esta función se encargará de iniciar la música automáticamente
function startMusic() {
  if (!hasUserInteracted) {
    audio.play();
    audio.volume = 0.1;
    hasUserInteracted = true;
  }
}

musicButton.addEventListener("click", () => {
  toggleMusic();
});
window.addEventListener("load", startMusic);