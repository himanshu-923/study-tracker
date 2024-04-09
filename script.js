let totalSeconds = 0;
let timerInterval;
let studyGoalInSeconds;
let breakDurationInSeconds;
let breakIntervalInSeconds;
let isBreakTime = false;
let remainingTimeBeforeBreak = 0;

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  if (!isBreakTime) {
    if (totalSeconds >= studyGoalInSeconds) {
      startBreak();
    } else {
      timerInterval = setInterval(incrementTimer, 1000);
    }
  } else {
    if (totalSeconds >= breakDurationInSeconds) {
      endBreak();
    } else {
      timerInterval = setInterval(incrementTimer, 1000);
    }
  }
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  totalSeconds = 0;
  remainingTimeBeforeBreak = 0;
  updateTimerDisplay();
}

function incrementTimer() {
  totalSeconds++;
  updateTimerDisplay();

  if (!isBreakTime && totalSeconds % breakIntervalInSeconds === 0) {
    clearInterval(timerInterval);
    remainingTimeBeforeBreak = studyGoalInSeconds - totalSeconds;
    openPopupWithTimer("It's break time!", breakDurationInSeconds);
  }

  if (isBreakTime && totalSeconds >= breakDurationInSeconds) {
    endBreak();
  }
}

function startBreak() {
  totalSeconds = 0;
  isBreakTime = true;
  timerInterval = setInterval(incrementTimer, 1000);
}

function endBreak() {
  clearInterval(timerInterval);
  totalSeconds = studyGoalInSeconds - remainingTimeBeforeBreak;
  isBreakTime = false;
  remainingTimeBeforeBreak = 0;
  closePopup();
  startTimer(); // Resume study timer
}

function updateTimerDisplay() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  document.getElementById("timer").innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progress = (totalSeconds / studyGoalInSeconds) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

function openPopupWithTimer(message, durationInSeconds) {
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");
  popupContent.innerHTML = message;
  popup.style.display = "block";

  const breakTimer = document.createElement("p");
  breakTimer.id = "break-timer";
  popupContent.appendChild(breakTimer);
  updateBreakTimerDisplay(durationInSeconds);

  // Start the break timer countdown
  const breakTimerInterval = setInterval(function() {
    durationInSeconds--;
    updateBreakTimerDisplay(durationInSeconds);

    if (durationInSeconds <= 0) {
      clearInterval(breakTimerInterval);
      endBreak();
    }
  }, 1000);
}

function updateBreakTimerDisplay(durationInSeconds) {
  const breakTimer = document.getElementById("break-timer");
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  breakTimer.innerText = `Break time remaining: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

document.getElementById("goalForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const hours = parseInt(document.getElementById("hours").value);
  const minutes = parseInt(document.getElementById("minutes").value);
  const seconds = parseInt(document.getElementById("seconds").value);
  studyGoalInSeconds = hours * 3600 + minutes * 60 + seconds;

  const breakDurationHours = parseInt(document.getElementById("breakDurationHours").value);
  const breakDurationMinutes = parseInt(document.getElementById("breakDurationMinutes").value);
  const breakDurationSeconds = parseInt(document.getElementById("breakDurationSeconds").value);
  breakDurationInSeconds = breakDurationHours * 3600 + breakDurationMinutes * 60 + breakDurationSeconds;

  const breakIntervalHours = parseInt(document.getElementById("breakIntervalHours").value);
  const breakIntervalMinutes = parseInt(document.getElementById("breakIntervalMinutes").value);
  const breakIntervalSeconds = parseInt(document.getElementById("breakIntervalSeconds").value);
  breakIntervalInSeconds = breakIntervalHours * 3600 + breakIntervalMinutes * 60 + breakIntervalSeconds;

  resetTimer();
});

document.getElementById("close-popup").addEventListener("click", closePopup);