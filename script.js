const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//   add days
const renderCalendar = () => {
  // get prev month days, next month days, current month days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDayIndex = lastDay.getDay();
  const prevDaysIndex = firstDay.getDay();
  const nextDays = 7 - lastDayIndex - 1;

  //   add month and year
  date.innerHTML = months[month] + " " + year;

  // add prev month days
  let days = "";
  for (let x = prevDaysIndex; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // add current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    // today ? class today : ""
    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      days += `<div class="day today">${i}</div>`;
    } else {
      days += `<div class="day">${i}</div>`;
    }
  }

  // add next month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
};

// render calendar
renderCalendar();

// prev month
const prevMonth = () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  renderCalendar();
};

// next month
const nextMonth = () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  renderCalendar();
};

// click prev month
prev.addEventListener("click", prevMonth);
// click next month
next.addEventListener("click", nextMonth);

// goto date & today
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  renderCalendar();
});

dateInput.addEventListener("keyup", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
});

const gotoDate = () => {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] <= 12 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      renderCalendar();
      return;
    }
  }
  alert("Please enter a valid date");
};
gotoBtn.addEventListener("click", gotoDate);
