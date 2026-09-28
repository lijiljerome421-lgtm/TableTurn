const API = "/api";


/* ================= RESTAURANT HOURS ================= */

const OPENING_TIME = "11:00";
const CLOSING_TIME = "22:00";

const TIME_INTERVAL = 30;


/* ================= STATE ================= */

let selectedTable = null;
let allTables = [];


/* ================= PAGE LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setDefaultDate();

        setupTimePickers();

        loadTablesForCapacity();

    }
);


/* ================= DEFAULT DATE ================= */

function setDefaultDate() {

    const dateInput =
        document.getElementById(
            "reservationDate"
        );


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    const todayString =
        `${year}-${month}-${day}`;


    dateInput.value =
        todayString;


    dateInput.min =
        todayString;


    dateInput.addEventListener(
        "change",
        function () {

            selectedTable = null;

        }
    );

}


/* ================= TIME PICKERS ================= */

function setupTimePickers() {

    const startSelect =
        document.getElementById(
            "startTime"
        );


    const endSelect =
        document.getElementById(
            "endTime"
        );


    const times =
        generateTimeSlots();


    times.forEach(
        time => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                time;

            option.textContent =
                formatTime(time);

            startSelect.appendChild(
                option
            );

        }
    );


    startSelect.addEventListener(
        "change",
        function () {

            updateEndTimes(
                this.value
            );

        }
    );


    endSelect.addEventListener(
        "change",
        function () {

            selectedTable = null;

        }
    );

}


/* ================= GENERATE TIMES ================= */

function generateTimeSlots() {

    const slots = [];


    let current =
        timeToMinutes(
            OPENING_TIME
        );


    const closing =
        timeToMinutes(
            CLOSING_TIME
        );


    while (
        current <= closing
    ) {

        slots.push(
            minutesToTime(current)
        );


        current +=
            TIME_INTERVAL;

    }


    return slots;

}


/* ================= UPDATE END TIMES ================= */

function updateEndTimes(
    selectedStart
) {

    const endSelect =
        document.getElementById(
            "endTime"
        );


    endSelect.innerHTML = `

        <option value="">
            Select leaving time
        </option>

    `;


    if (!selectedStart) {

        return;

    }


    const start =
        timeToMinutes(
            selectedStart
        );


    const closing =
        timeToMinutes(
            CLOSING_TIME
        );


    /*
     * End time must be
     * after start time.
     */

    for (
        let time = start + TIME_INTERVAL;
        time <= closing;
        time += TIME_INTERVAL
    ) {

        const value =
            minutesToTime(time);


        const option =
            document.createElement(
                "option"
            );


        option.value =
            value;


        option.textContent =
            formatTime(value);


        endSelect.appendChild(
            option
        );

    }

}


/* ================= TIME CONVERSION ================= */

function timeToMinutes(time) {

    const [
        hours,
        minutes
    ] =
        time.split(":")
            .map(Number);


    return (
        hours * 60
        + minutes
    );

}


function minutesToTime(minutes) {

    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    return (
        String(hours)
            .padStart(2, "0")
        + ":" +
        String(mins)
            .padStart(2, "0")
    );

}


/* ================= DISPLAY TIME ================= */

function formatTime(time) {

    const [
        hour,
        minute
    ] =
        time.split(":")
            .map(Number);


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    const displayHour =
        hour % 12 || 12;


    return `${displayHour}:${String(
        minute
    ).padStart(2, "0")} ${period}`;

}


/* ================= LOAD TABLES ================= */

async function loadTablesForCapacity() {

    try {

        const response =
            await fetch(
                `${API}/tables`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load restaurant tables."
            );

        }


        allTables =
            await response.json();


        updateGuestOptions();


    } catch (error) {

        console.error(error);


        document.getElementById(
            "capacityInfo"
        ).textContent =
            "Unable to load table capacity.";

    }

}


/* ================= GUEST OPTIONS ================= */

function updateGuestOptions() {

    const guestSelect =
        document.getElementById(
            "partySize"
        );


    const capacityInfo =
        document.getElementById(
            "capacityInfo"
        );


    guestSelect.innerHTML = `

        <option value="">
            Select number of guests
        </option>

    `;


    if (
        allTables.length === 0
    ) {

        capacityInfo.textContent =
            "No tables have been added yet.";

        return;

    }


    const maxCapacity =
        Math.max(
            ...allTables.map(
                table =>
                    Number(
                        table.capacity
                    )
            )
        );


    for (
        let guests = 1;
        guests <= maxCapacity;
        guests++
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            guests;


        option.textContent =
            guests === 1
                ? "1 Guest"
                : `${guests} Guests`;


        guestSelect.appendChild(
            option
        );

    }


    capacityInfo.textContent =
        `Largest available table: ${maxCapacity} guests.`;

}


/* ================= SCROLL ================= */

function scrollToReservation() {

    document
        .getElementById(
            "reservation"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ================= FIND TABLES ================= */

async function findTables() {

    const name =
        document.getElementById(
            "customerName"
        ).value.trim();


    const date =
        document.getElementById(
            "reservationDate"
        ).value;


    const guests =
        Number(
            document.getElementById(
                "partySize"
            ).value
        );


    const startTime =
        document.getElementById(
            "startTime"
        ).value;


    const endTime =
        document.getElementById(
            "endTime"
        ).value;


    if (!name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    if (!date) {

        alert(
            "Please select a date."
        );

        return;

    }


    if (!startTime) {

        alert(
            "Please select your arrival time."
        );

        return;

    }


    if (!endTime) {

        alert(
            "Please select your leaving time."
        );

        return;

    }


    if (!guests) {

        alert(
            "Please select number of guests."
        );

        return;

    }


    if (
        startTime >= endTime
    ) {

        alert(
            "Leaving time must be after arrival time."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/tables`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load tables."
            );

        }


        allTables =
            await response.json();


        const suitableTables =
            allTables.filter(
                table =>
                    table.status === "FREE"
                    &&
                    Number(
                        table.capacity
                    ) >= guests
            );


        displayTables(
            suitableTables,
            guests
        );


        document
            .getElementById(
                "tables"
            )
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error(error);

        alert(
            error.message
        );

    }

}


/* ================= DISPLAY TABLES ================= */

function displayTables(
    tables,
    guests
) {

    const container =
        document.getElementById(
            "tableContainer"
        );


    const info =
        document.getElementById(
            "tableAvailabilityInfo"
        );


    container.innerHTML = "";


    selectedTable =
        null;


    document.getElementById(
        "selectedInfo"
    ).innerHTML =
        "<p>No table selected</p>";


    document.getElementById(
        "reserveButton"
    ).disabled = true;


    if (
        tables.length === 0
    ) {

        info.textContent =
            `No table is available for ${guests} guests at this time.`;


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ×
                </div>

                <h3>
                    No suitable tables
                </h3>

                <p>
                    We don't currently have
                    a suitable table for
                    ${guests} guests.
                </p>

            </div>

        `;

        return;

    }


    info.textContent =
        `${tables.length} table(s) available for ${guests} guest(s).`;


    tables.forEach(
        table => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "table-card";


            card.innerHTML = `

                <div class="table-number">
                    ${table.tableNumber}
                </div>

                <h3>
                    Table ${table.tableNumber}
                </h3>

                <p>
                    Capacity:
                    ${table.capacity} guests
                </p>

                <div class="table-status available-text">
                    ✓ Available
                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    selectTable(
                        table,
                        card
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


/* ================= SELECT TABLE ================= */

function selectTable(
    table,
    card
) {

    document
        .querySelectorAll(
            ".table-card"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "selected"
                )
        );


    card.classList.add(
        "selected"
    );


    selectedTable =
        table;


    document.getElementById(
        "selectedInfo"
    ).innerHTML = `

        <p>

            Selected:

            <strong>
                Table ${table.tableNumber}
            </strong>

            ·

            ${table.capacity} seats

        </p>

    `;


    document.getElementById(
        "reserveButton"
    ).disabled = false;

}


/* ================= RESERVE ================= */

async function reserveTable() {

    if (!selectedTable) {

        alert(
            "Please select a table."
        );

        return;

    }


    const customerName =
        document.getElementById(
            "customerName"
        ).value.trim();


    const date =
        document.getElementById(
            "reservationDate"
        ).value;


    const startTime =
        document.getElementById(
            "startTime"
        ).value;


    const endTime =
        document.getElementById(
            "endTime"
        ).value;


    const partySize =
        Number(
            document.getElementById(
                "partySize"
            ).value
        );


    const reservation = {

        customerName,

        date,

        startTime,

        endTime,

        partySize,

        table: {
            id: selectedTable.id
        }

    };


    try {

        const response =
            await fetch(
                `${API}/reservations`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            reservation
                        )

                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            throw new Error(
                responseText ||
                `Server error: ${response.status}`
            );

        }


        let savedReservation;


        try {

            savedReservation =
                JSON.parse(
                    responseText
                );

        } catch {

            savedReservation =
                reservation;

        }


        showSuccess(
            savedReservation
        );


        resetReservationForm();


    } catch (error) {

        console.error(
            "Reservation failed:",
            error
        );


        alert(
            "Reservation failed:\n\n"
            + error.message
        );

    }

}


/* ================= RESET ================= */

function resetReservationForm() {

    document.getElementById(
        "customerName"
    ).value = "";


    document.getElementById(
        "partySize"
    ).value = "";


    document.getElementById(
        "startTime"
    ).value = "";


    document.getElementById(
        "endTime"
    ).innerHTML = `

        <option value="">
            Select leaving time
        </option>

    `;


    setDefaultDate();


    selectedTable =
        null;


    document.getElementById(
        "tableContainer"
    ).innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                ◯
            </div>

            <h3>
                No table selected
            </h3>

            <p>
                Enter your reservation details
                to see available tables.
            </p>

        </div>

    `;


    document.getElementById(
        "selectedInfo"
    ).innerHTML =
        "<p>No table selected</p>";


    document.getElementById(
        "reserveButton"
    ).disabled = true;


    document.getElementById(
        "tableAvailabilityInfo"
    ).textContent =
        "Select your date, time and number of guests first.";

}


/* ================= SUCCESS ================= */

function showSuccess(
    reservation
) {

    const tableNumber =
        selectedTable.tableNumber;


    document.getElementById(
        "successMessage"
    ).innerHTML = `

        Thank you,
        <strong>
            ${reservation.customerName}
        </strong>.

        <br><br>

        Your table reservation is confirmed.

        <br>

        <strong>
            Table ${tableNumber}
        </strong>

        · ${reservation.date}

        <br>

        ${formatTime(
            reservation.startTime
        )}

        –

        ${formatTime(
            reservation.endTime
        )}

    `;


    document.getElementById(
        "successSection"
    ).style.display =
        "block";


    document.getElementById(
        "successSection"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= NEW RESERVATION ================= */

function startNewReservation() {

    document.getElementById(
        "successSection"
    ).style.display =
        "none";


    document.getElementById(
        "reservation"
    ).scrollIntoView({
        behavior: "smooth"
    });

}