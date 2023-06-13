import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";


const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

const dataFormat = "Y-m-d H:i";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  dateFormat: dataFormat,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      Notiflix.Notify.warning("Please choose a date and time in the future");
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

let countdownInterval;
 
function startCountdown() {
  debugger 
  const selectedDate = flatpickr.parseDate(datetimePicker.value, dataFormat);
  const currentDate = new Date();

  const countdown = selectedDate.getTime() - currentDate.getTime();
  const countdownDuration = Math.max(countdown, 0);

  if (countdownDuration <= 0) {
    clearInterval(countdownInterval);
    startButton.disabled = false;
    Notiflix.Report.success("Countdown Complete", "The countdown has finished.", "OK");
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(countdownDuration);

  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // debugger  
  let remainingTime = ms;

  let days = Math.floor(remainingTime / day);
  remainingTime %= day;

  let hours = Math.floor(remainingTime / hour);
  remainingTime %= hour;

  let minutes = Math.floor(remainingTime / minute);
  remainingTime %= minute;

  let seconds = Math.floor(remainingTime / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  countdownInterval = setInterval(startCountdown, 1000);
  startCountdown();
});

document.addEventListener("DOMContentLoaded", () => {
  startButton.disabled = true;
});
