const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  dateInput = document.querySelector(".date-input"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  addEventContainer = document.querySelector(".add-event-wrapper"),
  addEventsBtn = document.querySelector(".add-events"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventDeleteBtn = document.querySelector(".delete-event"),
  addEventName = document.querySelector(".event-name"),
  addEventTimeFrom = document.querySelector(".event-time-from"),
  addEventTimeTo = document.querySelector(".event-time-to"),
  addEventPriority = document.getElementsByName("event-type"),
  addEventBtn = document.querySelector(".add-event-btn"),
  switchBtn = document.querySelector("input[name='switch']"),
  completedContainer = document.querySelector(".completed"),
  eventsContainer = document.querySelector(".events"),
  eventHelper = document.querySelector(".event-helper"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  clearContainer = document.querySelector(".clear-events-wrapper"),
  clearBtn = document.querySelector(".clear-events"),
  clearAllBtn = document.querySelector(".clear-all"),
  clearTodayBtn = document.querySelector(".clear-day");

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

let eventsArr = [];
// local storage
const saveEvents = () =>
  localStorage.setItem("events", JSON.stringify(eventsArr));
const getEvents = () => {
  eventsArr.push(...(JSON.parse(localStorage.getItem("events")) || []));
};
// get events from local storage && add to eventsArr
getEvents();

// add days to calendar
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
    // event present on current day ?
    let eventPresent = false;
    eventsArr.forEach((event) => {
      if (event.day === i && event.month === month + 1 && event.year === year) {
        eventPresent = true;
      }
    });
    // is today ? add class today && active : ""
    // any event present ? add class event : ""
    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (eventPresent) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (eventPresent) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  // add next month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  // add listner after render
  addListner();
};

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

// click today
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  renderCalendar();
});

// format goto date input
dateInput.addEventListener("keyup", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
});

// goto date
const gotoDate = () => {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] <= 12 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      renderCalendar();
      dateInput.value = "";
      return;
    }
  }
  alert("Please enter a valid date");
};
gotoBtn.addEventListener("click", gotoDate);

// show | hide add events and clear container
addEventsBtn.addEventListener("click", () => {
  addEventContainer.classList.toggle("active");
});
addEventCloseBtn.addEventListener("click", () => {
  addEventContainer.classList.remove("active");
});
clearBtn.addEventListener("click", () => {
  clearContainer.classList.toggle("disabled");
});
document.addEventListener("click", (e) => {
  if (e.target !== addEventsBtn && !addEventContainer.contains(e.target)) {
    addEventContainer.classList.remove("active");
  }
  if (e.target !== clearBtn && !clearContainer.contains(e.target)) {
    clearContainer.classList.add("disabled");
  }
});

// input format
addEventName.addEventListener("input", () => {
  addEventName.value = addEventName.value.slice(0, 50);
});
addEventTimeFrom.addEventListener("input", () => {
  addEventTimeFrom.value = addEventTimeFrom.value.replace(/[^0-9:]/g, "");
  if (addEventTimeFrom.value.length === 2) {
    addEventTimeFrom.value += ":";
  }
  if (addEventTimeFrom.value.length > 5) {
    addEventTimeFrom.value = addEventTimeFrom.value.slice(0, 5);
  }
});
addEventTimeTo.addEventListener("input", () => {
  addEventTimeTo.value = addEventTimeTo.value.replace(/[^0-9:]/g, "");
  if (addEventTimeTo.value.length === 2) {
    addEventTimeTo.value += ":";
  }
  if (addEventTimeTo.value.length > 5) {
    addEventTimeTo.value = addEventTimeTo.value.slice(0, 5);
  }
});

// listner
const addListner = () => {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      // set current day as active day
      activeDay = Number(e.target.innerHTML);
      // call active day function
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      // remove active class from active days
      days.forEach((day) => {
        day.classList.remove("active");
      });
      // if prev month day clicked goto prev month and add active class
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        // if next month day clicked goto next month and add active class
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        // add active class to current month day
        e.target.classList.add("active");
      }
    });
  });
};

// show active day on right container
const getActiveDay = (date) => {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.textContent = dayName;
  eventDate.textContent = date + " " + months[month] + " " + year;
};

// show || update events
const updateEvents = (date) => {
  let events = "";
  let eventsDone = "";
  eventsArr.forEach((event) => {
    if (
      event.day === date &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        const isDone = event.status === "done" ? true : false;
        if (!isDone) {
          events += `<div class="event">
          <div class="title">
          <i class="fas fa-circle"></i>
            <h3 class="event-title">${event.name}</h3>
          </div>
          <div class="event-time">
          <i class="fas fa-clock"></i>
            <span class="event-time-from">${event.time}</span>
            <span class="event-priority ${event.priority}">#${event.priority}</span>
          </div>
          <div class="event-helper">
            <span>click to mark as done</span>
          </div>
        </div>`;
        } else {
          events += `<div class="event grayscaled">
          <div class="title">
          <i class="fas fa-check"></i>
            <h3 class="event-title done">${event.name}</h3>
          </div>
          <div class="event-time">
            <span class="event-time-from done">${event.time}</span>
            <span class="event-priority ${event.priority}">#DONE</span>
          </div>
        </div>`;
          eventsDone += `<div class="event">
          <div class="title">
          <i class="fas fa-check"></i>
            <h3 class="event-title">${event.name}</h3>
          </div>
        </div>`;
        }
      });
    }
  });

  if (events === "") {
    events = `<div class="no-event">
    <h3>Nothing todo</h3>
  </div>`;
  }
  if (eventsDone === "") {
    eventsDone = `<div class="no-event">
    <h3>You haven't done anything yet!</h3>
  </div>`;
  }

  eventsContainer.innerHTML = events;
  completedContainer.innerHTML = eventsDone;
  // save when update called
  saveEvents();
};

// add event
addEventBtn.addEventListener("click", () => {
  const eventName = addEventName.value;
  const eventTimeFrom = addEventTimeFrom.value;
  const eventTimeTo = addEventTimeTo.value;
  let eventPriority;
  // test radio button
  for (let i = 0; i < addEventPriority.length; i++) {
    if (addEventPriority[i].checked) {
      eventPriority = addEventPriority[i].value;
    }
  }

  if (
    eventName === "" ||
    eventTimeFrom === "" ||
    eventTimeTo === "" ||
    !eventPriority
  ) {
    alert("Please fill all fields");
    return;
  }
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59 ||
    timeFromArr[0] > timeToArr[0] ||
    (timeFromArr[0] === timeToArr[0] && timeFromArr[1] >= timeToArr[1])
  ) {
    alert("Please enter valid time");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);
  const newEvent = {
    name: eventName,
    time: timeFrom + " - " + timeTo,
    priority: eventPriority,
  };

  let eventAdded = false;
  // checkk if eventsArr not empty
  if (eventsArr.length > 0) {
    // check if current day has events
    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        event.events.push(newEvent);
        eventAdded = true;
      }
    });
  }
  // if eventsArr is empty or current day has no events
  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }
  // clear add event form
  addEventName.value = "";
  addEventTimeFrom.value = "";
  addEventTimeTo.value = "";
  addEventPriority[0].checked = false;
  addEventPriority[1].checked = false;
  addEventPriority[2].checked = false;
  addEventContainer.classList.remove("active");
  // show current day events
  updateEvents(activeDay);
  // add event class to active day
  const activeDayEl = document.querySelector(".day.active");
  activeDayEl.classList.add("event");
});

const convertTime = (time) => {
  let timeArr = time.split(":");
  let hours = Number(timeArr[0]);
  let minutes = Number(timeArr[1]);
  let timeFormat = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + timeFormat;
};

// switch todos | done
switchBtn.addEventListener("change", () => {
  if (switchBtn.checked) {
    eventsContainer.classList.add("disabled");
    completedContainer.classList.remove("disabled");
  } else {
    eventsContainer.classList.remove("disabled");
    completedContainer.classList.add("disabled");
  }
});

//mark event as done
eventsContainer.addEventListener("click", (e) => {
  const eventName = e.target.children[0].children[1].textContent;
  if (e.target.classList.contains("event")) {
    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        event.events.forEach((item) => {
          if (item.name === eventName) {
            item.status = "done";
          }
        });
      }
    });
    updateEvents(activeDay);
  }
});

// delete event
clearAllBtn.addEventListener("click", () => {
  // localStorage.removeItem("events");
  eventsArr = [];
  updateEvents(activeDay);
});
// delete today's events
clearTodayBtn.addEventListener("click", () => {
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events = [];
    }
  });
  const activeDayEl = document.querySelector(".day.active");
  activeDayEl.classList.remove("event");
  updateEvents(activeDay);
});

// render calendar on load
renderCalendar();
