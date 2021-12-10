let allMonths = document.querySelector("#months");
let btn = document.querySelector(".btn");
let calender = document.querySelector(".calender");
let monthName = document.querySelector(".month-name");
let inputHolder = document.querySelector(".input-container");
let showEvent = document.querySelector(".show-event");

let selectedDate = null; 
let finalMonthNumber;

const getAllEvents = () => JSON.parse(localStorage.getItem("events")) || [];

function updateEventData(item) {

    let events = getAllEvents();
    events.push(item);
    localStorage.setItem("events", JSON.stringify(events));
    renderMonthCalendar(finalMonthNumber);
}

const findEvent = id =>
    getAllEvents().find(e => e.id === id);

const addAnEvent = (title, date) => {

    let id = new Date().getTime()/1000;
    const newEvent = { id, title, date };
    updateEventData(newEvent);
}

function removeEventFromEvents(item, id) {
    let events = getAllEvents();
    events.splice(event.id, 1);
    localStorage.setItem("events", JSON.stringify(events));
    renderMonthCalendar(finalMonthNumber);
}

const months = [
    { number: 1, days: 31, name: "January" },
    { number: 2, days: 28, name: "February" },
    { number: 3, days: 31, name: "March" },
    { number: 4, days: 30, name: "April" },
    { number: 5, days: 31, name: "May" },
    { number:  6, days: 30, name: "June" },
    { number: 7, days: 31, name: "July" },
    { number: 8, days: 31, name: "August" },
    { number: 9, days: 30, name: "September" },
    { number: 10, days: 31, name: "October" },
    { number: 11, days: 30, name: "November" },
    { number: 12, days: 31, name: "December" }
]

function handleChange(event) {
    let chosenMonthName = "January";
    chosenMonthName = event.target.value;  
    let chosenMonth = months.find(m => m.name === chosenMonthName);
    renderMonthCalendar(chosenMonth.number);
}

allMonths.addEventListener("change", handleChange);

function createInput(month, date, monthNumber) {
    inputHolder.innerHTML = "";
    let input = document.createElement("input")
    input.placeholder = `Add Event on ${date} of ${month}`;
    inputHolder.append(input); 

    input.addEventListener("keyup", (event) =>{   
        if (event.keyCode === 13) {
            let eventName = event.target.value;
            addAnEvent(eventName, selectedDate);
            event.target.value = "";
    
            renderMonthCalendar(Number(monthNumber));
        }
    });
}


function handleClickDate(event) {
    let date = event.target.dataset.date;
    let month = event.target.parentElement.dataset.month;
    let monthNumber = event.target.parentElement.dataset.monthnumber;

    selectedDate = new Date(`${month} ${date}, 2021`);

    createInput(month, date, monthNumber);

    renderMonthCalendar(Number(monthNumber));
}

function renderMonthCalendar(month) {
    finalMonthNumber = month;
    let monthNumber = month;
    let currentMonth = month;
    let totalDays ;

    let monthData = months.find(m => m.number === month);
    currentMonth = monthData.name;
    totalDays = monthData.days;

    calender.innerHTML = "";

    let ul = document.createElement("ul");
    ul.setAttribute("data-month", currentMonth);
    ul.setAttribute("data-monthNumber", month);

    for (let i = 1; i <= totalDays; i++){

        let li = document.createElement("li");
        li.className = "";

        let event = getAllEvents().find(e => {
            let date = new Date(e.date);
            let day = date.getDate();
            let month = date.getMonth() + 1;

            return month === monthNumber && day === i;
        });

        if (event) {
            li.classList.add("selected")
        }
    
        li.innerText = i;
        li.setAttribute("data-date", i);
        ul.append(li);
        li.addEventListener("click", handleClickDate);
    }
    monthName.innerText = currentMonth;
    calender.append(ul);
}

function handleClear(e) {
    let id = e.target.parentElement.dataset.id;
    let event = findEvent(id);
   
    removeEventFromEvents(event);
    showAllEvents();
}

function showAllEvents() {
    showEvent.innerHTML = "";

    let ul = document.createElement("ul");

    getAllEvents().forEach((e, i) => {
        let li = document.createElement("li");
        li.setAttribute("data-id", e.id)
        let span = document.createElement("span");
        span.innerText = "❌";
        span.setAttribute("data-id", e.id)
        li.innerText = `${e.title} - ${e.date}`;
        li.append(span)
        ul.append(li);

        span.addEventListener("click", handleClear);
    })
    showEvent.append(ul); 
}

btn.addEventListener("click", ()=> {
    showAllEvents();
})

// Render first month first time.
renderMonthCalendar(1);

