const questionElement = document.getElementById("question");
const flagElement = document.getElementById("flag");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const replayButton = document.getElementById("replay-btn");
const resultElement = document.getElementById("result");

let currentQuestionIndex = 0;
let score = 0;
let startTime, endTime;
const totalQuestions = 10;
let userName = "";
let scoreValue = "";
let timeValue = "";
let countries = [];

// Funcion que obtiene los paises
async function fetchCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,capital"
    );
    const data = await response.json();
    countries = data;
    shuffleArray(countries);
    showNextQuestion();
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

// Funcion que muestra la siguiente pregunta
async function showNextQuestion() {
  nextButton.disabled = true;
  replayButton.style.display = "none";
  resultElement.textContent = "";
  optionsElement.innerHTML = "";

  if (currentQuestionIndex < totalQuestions) {
    const isQuestionAboutFlag = Math.random() < 0.5;

    if (isQuestionAboutFlag) {
      // Generar pregunta sobre bandera
      const country = countries[currentQuestionIndex];
      const countryName = country.name.common;
      const flagURL = country.flags.png;

      questionElement.textContent = `¿A qué país pertenece esta bandera?`;
      flagElement.src = flagURL;

      flagElement.style.display = "block";

      const options = getRandomOptions(countryName);
      const correctAnswer = countryName;

      options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("nes-btn", "is-primary");
        button.addEventListener("click", () =>
          checkAnswer(option, correctAnswer)
        );
        optionsElement.appendChild(button);
      });
    } else {
      // Generar pregunta sobre capital
      const country = countries[currentQuestionIndex];
      const countryName = country.name.common;
      const capital = country.capital[0];
      const capitalURL = country.flags.png;

      questionElement.textContent = `¿Cuál es la capital de ${countryName}?`;
      flagElement.src = capitalURL;

      flagElement.style.display = "block";

      const options = getRandomOptions(capital);
      const correctAnswer = capital;

      options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("nes-btn", "is-primary");
        button.addEventListener("click", () =>
          checkAnswer(option, correctAnswer)
        );
        optionsElement.appendChild(button);
      });
    }
  } else {
    nextButton.style.display = "none";
    showResults();
  }
}

// Boton de la siguiente pregunta
nextButton.addEventListener("click", showNextQuestion);

// Funcion que obtiene las opciones random
function getRandomOptions(correctAnswer) {
  const allCountries = countries.map((c) => c.name.common);
  const shuffledOptions = shuffleArray(
    allCountries.filter((country) => country !== correctAnswer)
  );
  const options = [
    correctAnswer,
    shuffledOptions[0],
    shuffledOptions[1],
    shuffledOptions[2],
  ];
  return shuffleArray(options);
}

// Verifica la respuesta.
function checkAnswer(selectedOption, correctAnswer) {
  const optionButtons = optionsElement.getElementsByTagName("button");

  for (const button of optionButtons) {
    button.disabled = true;
    if (button.textContent === correctAnswer) {
      button.style.backgroundColor = "green";
      button.style.color = "white";
    } else {
      button.style.backgroundColor = "red";
      button.style.color = "white";
    }
  }

  if (selectedOption === correctAnswer) {
    score++;
  }
  currentQuestionIndex++;
  nextButton.disabled = false;
}

// Mezcla el array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Función para mostrar los resultados
function showResults() {
  endTime = new Date();
  const timeTaken = (endTime - startTime) / 1000;
  const averageTime = timeTaken / totalQuestions;

  if (!replayButton.style.display || replayButton.style.display === "none") {
    userName = document.getElementById("nick").value;
    scoreValue = score;
    timeValue = timeTaken.toFixed(2);

    fetch("/save-nick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nick: userName,
        score: scoreValue,
        time: timeValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al enviar datos del jugador:", error);
      });
  }

  // Ocultar elementos de juego
  questionElement.style.display = "none";
  flagElement.style.display = "none";
  optionsElement.style.display = "none";

  // Mostrar mensaje de felicitación
  const congratulationsMessage = document.createElement("p");
  congratulationsMessage.textContent = `¡Felicitaciones, ${userName}! Estos son tus resultados:`;
  resultElement.appendChild(congratulationsMessage);

  const resultsMessage = document.createElement("div");
  resultsMessage.style.textAlign = "center";

  const content = document.createElement("div");
  content.innerHTML = `Puntaje: ${score}/${totalQuestions}<br>Tiempo total: ${timeTaken.toFixed(
    2
  )} segundos<br>Tiempo promedio por pregunta: ${averageTime.toFixed(
    2
  )} segundos`;
  resultsMessage.appendChild(content);
  resultElement.appendChild(resultsMessage);

  // Mostrar el contenedor de botones "REINTENTAR" y "FINALIZAR"
  const buttonContainer = document.getElementById("button-container");
  buttonContainer.style.display = "flex";
  buttonContainer.style.display = "block";
  replayButton.style.display = "block";
  replayButton.style.marginRight = "10px";

  if (currentQuestionIndex >= totalQuestions) {
    const endButton = document.getElementById("end-btn");
    endButton.style.display = "block";
    endButton.style.marginLeft = "10px";
    endButton.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  } else {
    const endButton = document.getElementById("end-btn");
    endButton.style.display = "none";
  }
}

// Reinicio del juego
replayButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  fetchCountries();
  startTime = new Date();
  replayButton.style.display = "none";
  nextButton.style.display = "block";

  // Oculta el botón "FINALIZAR" cuando se presiona "REINTENTAR"
  const endButton = document.getElementById("end-btn");
  endButton.style.display = "none";

  // Mostrar elementos de juego nuevamente
  questionElement.style.display = "block";
  flagElement.style.display = "block";
  optionsElement.style.display = "block";
});

// Inicia el juego
fetchCountries();
startTime = new Date();

document
  .getElementById("nick-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    userName = document.getElementById("nick").value;

    const scoreValue = score;
    const timeValue = (new Date() - startTime) / 1000;

    document.getElementById("nick-form").style.display = "none";
    document.getElementById("question-wrapper").style.display = "block";
    document.getElementById("score").value = scoreValue;
    document.getElementById("time").value = timeValue;
  });

// Modal de los 20 mejores.
const showLeaderboardButton = document.getElementById("show-leaderboard");
const modal = document.getElementById("leaderboard-modal");
const closeButton = modal.querySelector(".close");
const leaderboardDiv = document.getElementById("leaderboard");

let leaderboardLoaded = false;
let dataLoaded = false;

showLeaderboardButton.addEventListener("click", () => {
  if (!leaderboardLoaded) {
    showModal();
    displayLeaderboard();
    leaderboardLoaded = true;
  }
});

closeButton.addEventListener("click", () => {
  closeModal();
  leaderboardLoaded = false;
});

function showModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

async function displayLeaderboard() {
  try {
    if (!dataLoaded) {
      const loaderText = document.getElementById("loading-text");
      const loader = document.getElementById("loader");

      loaderText.style.display = "block";
      loader.style.display = "block";

      const response = await fetch("/get-leaderboard");
      if (!response.ok) {
        throw new Error("Error al obtener datos del leaderboard");
      }

      const playerData = await response.json();

      playerData.sort((a, b) => {
        if (b.score === a.score) {
          return a.time - b.time;
        }
        return b.score - a.score;
      });

      let leaderboardContent =
        "<h1 id='leaderboard-title' style='font-size: 50px; color: #007ced;'>TOP 20 JUGADORES</h1>";
      leaderboardContent += "<ul>";

      // Agregar medalla 🥇 al primer lugar
      if (playerData.length > 0) {
        leaderboardContent += `<li>🥇 ${playerData[0].nick} - PUNTAJE: ${playerData[0].score}, TIEMPO: ${playerData[0].time} SEGUNDOS</li>`;
      }

      // Muestra los siguientes jugadores
      for (let i = 1; i < Math.min(20, playerData.length); i++) {
        leaderboardContent += `<li>${playerData[i].nick} - PUNTAJE: ${playerData[i].score}, TIEMPO: ${playerData[i].time} SEGUNDOS</li>`;
      }

      leaderboardContent += "</ul>";
      leaderboardDiv.innerHTML = leaderboardContent;

      // Ocultar el texto y el GIF cuando se complete la carga
      loaderText.style.display = "none";
      loader.style.display = "none";

      dataLoaded = true;
    }
  } catch (error) {
    console.error("Error al obtener y mostrar el leaderboard:", error);
  }
}
