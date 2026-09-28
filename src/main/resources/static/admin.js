const API = "/api/admin";


document.addEventListener("DOMContentLoaded", function () {

    loadTables();
    loadReservations();

});


/* LOAD TABLES */

async function loadTables() {

    const container =
        document.getElementById("adminTableContainer");

    container.innerHTML =
        '<div class="loading">Loading tables...</div>';

    try {

        const response =
            await fetch(`${API}/tables`);

        if (!response.ok) {
            throw new Error("Failed to load tables");
        }

        const tables =
            await response.json();

        displayTables(tables);

    } catch (error) {

        console.error(error);

        container.innerHTML =
            '<div class="loading">Unable to load tables.</div>';

    }

}


/* DISPLAY TABLES */

function displayTables(tables) {

    const container =
        document.getElementById("adminTableContainer");

    container.innerHTML = "";

    if (tables.length === 0) {

        container.innerHTML = `
            <div class="loading">
                No tables have been added yet.
            </div>
        `;

        return;
    }


    tables.forEach(table => {

        const card =
            document.createElement("div");

        card.className = "admin-table";


        const statusClass =
            table.status === "SEATED"
                ? "seated"
                : "free";


        const statusText =
            table.status || "FREE";


        card.innerHTML = `

            <div class="admin-table-top">

                <div class="admin-table-number">
                    Table ${table.tableNumber}
                </div>

                <span class="status ${statusClass}">
                    ${statusText}
                </span>

            </div>

            <div class="capacity">
                Capacity: ${table.capacity} guests
            </div>

            <div class="table-actions">

                ${
                    table.status === "SEATED"

                    ? `
                        <button
                            class="action-btn"
                            onclick="freeTable(${table.id})"
                        >
                            Free
                        </button>
                    `

                    : `
                        <button
                            class="action-btn"
                            onclick="seatTable(${table.id})"
                        >
                            Seat
                        </button>
                    `
                }

                <button
                    class="action-btn delete-btn"
                    onclick="deleteTable(${table.id})"
                >
                    Delete
                </button>

            </div>
        `;


        container.appendChild(card);

    });

}


/* ADD TABLE */

async function addTable() {

    const tableNumber =
        Number(document.getElementById("tableNumber").value);

    const capacity =
        Number(document.getElementById("capacity").value);


    if (!tableNumber || !capacity) {

        alert("Enter table number and capacity.");

        return;

    }


    try {

        const response =
            await fetch(`${API}/tables`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    tableNumber: tableNumber,
                    capacity: capacity,
                    status: "FREE"
                })

            });


        if (!response.ok) {

            throw new Error("Failed to add table");

        }


        document.getElementById("tableNumber").value = "";
        document.getElementById("capacity").value = "";


        alert("Table added successfully.");

        loadTables();


    } catch (error) {

        console.error(error);

        alert("Could not add table.");

    }

}


/* SEAT TABLE */

async function seatTable(id) {

    try {

        const response =
            await fetch(`${API}/tables/${id}/seat`, {
                method: "PUT"
            });


        if (!response.ok) {
            throw new Error("Failed");
        }


        loadTables();


    } catch (error) {

        alert("Could not seat table.");

    }

}


/* FREE TABLE */

async function freeTable(id) {

    try {

        const response =
            await fetch(`${API}/tables/${id}/free`, {
                method: "PUT"
            });


        if (!response.ok) {
            throw new Error("Failed");
        }


        loadTables();


    } catch (error) {

        alert("Could not free table.");

    }

}


/* DELETE TABLE */

async function deleteTable(id) {

    const confirmed =
        confirm("Are you sure you want to delete this table?");


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`${API}/tables/${id}`, {
                method: "DELETE"
            });


        if (!response.ok) {
            throw new Error("Failed");
        }


        loadTables();


    } catch (error) {

        alert("Could not delete table.");

    }

}


/* LOAD RESERVATIONS */

async function loadReservations() {

    const container =
        document.getElementById("reservationContainer");

    container.innerHTML =
        '<div class="loading">Loading reservations...</div>';


    try {

        const response =
            await fetch("/api/reservations");


        if (!response.ok) {
            throw new Error("Failed");
        }


        const reservations =
            await response.json();


        displayReservations(reservations);


    } catch (error) {

        console.error(error);

        container.innerHTML =
            '<div class="loading">Unable to load reservations.</div>';

    }

}


/* DISPLAY RESERVATIONS */

function displayReservations(reservations) {

    const container =
        document.getElementById("reservationContainer");

    container.innerHTML = "";


    if (reservations.length === 0) {

        container.innerHTML = `
            <div class="loading">
                No reservations yet.
            </div>
        `;

        return;

    }


    reservations.forEach(reservation => {

        const item =
            document.createElement("div");

        item.className = "reservation-item";


        const tableNumber =
            reservation.table
                ? reservation.table.tableNumber
                : "N/A";


        item.innerHTML = `

            <div class="reservation-top">

                <div class="reservation-name">
                    ${reservation.customerName}
                </div>

                <strong>
                    Table ${tableNumber}
                </strong>

            </div>

            <div class="reservation-details">

                ${reservation.date}
                ·
                ${reservation.startTime}
                -
                ${reservation.endTime}
                ·
                ${reservation.partySize} guests

            </div>

        `;


        container.appendChild(item);

    });

}