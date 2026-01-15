const express = require("express");
const cors = require("cors");
const employeesData = require("./employees.json");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * 🔹 ROOT CHECK
 * Purpose: Check if server is running
 */
app.get("/", (req, res) => {
  res.send("✅ Employee API is running");
});

/**
 * 🔹 GET ALL DATA (EVERYTHING AT ONCE)
 * URL: /api/employees
 * Returns: All 30 employees with full details + reservations
 */
app.get("/api/employees", (req, res) => {
  res.json({
    total_employees: employeesData.employees.length,
    employees: employeesData.employees
  });
});
/**
 * 🔹 GET EMPLOYEE BY EMAIL
 * URL: /api/employees/email/:email
 * Returns: Full employee details
 */
app.get("/api/employees/email/:email", (req, res) => {
  const email = req.params.email;

  const employee = employeesData.employees.find(
    emp => emp.email === email
  );

  if (!employee) {
    return res.status(404).json({
      error: "Employee not found with this email"
    });
  }

  res.json(employee);
});

/**
 * 🔹 GET EMPLOYEE BY ID
 * URL: /api/employees/:id
 * Returns: Single employee object
 */
app.get("/api/employees/:id", (req, res) => {
  const employee = employeesData.employees.find(
    emp => emp.employee_id === req.params.id
  );

  if (!employee) {
    return res.status(404).json({
      error: "Employee not found"
    });
  }

  res.json(employee);
});

/**
 * 🔹 GET ONLY RESERVATIONS OF AN EMPLOYEE
 * URL: /api/employees/:id/reservations
 * Returns: Past reservations (0–3)
 */
app.get("/api/employees/:id/reservations", (req, res) => {
  const employee = employeesData.employees.find(
    emp => emp.employee_id === req.params.id
  );

  if (!employee) {
    return res.status(404).json({
      error: "Employee not found"
    });
  }

  res.json({
    employee_id: employee.employee_id,
    reservations: employee.reservations
  });
});

/**
 * 🔹 GET MANAGERS ONLY
 * URL: /api/managers
 * Returns: All employees who are managers
 */
app.get("/api/managers", (req, res) => {
  const managers = employeesData.employees.filter(
    emp => emp.is_manager === true
  );

  res.json({
    total_managers: managers.length,
    managers
  });
});

/**
 * 🔹 GET EMPLOYEES UNDER A MANAGER
 * URL: /api/manager/:email/employees
 * Returns: Employees reporting to that manager
 */
app.get("/api/manager/:email/employees", (req, res) => {
  const managerEmail = req.params.email;

  const team = employeesData.employees.filter(
    emp => emp.manager === managerEmail
  );

  res.json({
    manager_email: managerEmail,
    team_size: team.length,
    employees: team
  });
});

/**
 * 🔹 SERVER START
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
/**
 * 🔹 GET SEAT AVAILABILITY
 * URL: /api/seats
 * Returns: Seats 1–100 with true if booked, false if free
 */
app.get("/api/seats", (req, res) => {
  // Initialize all seats as false (available)
  const seats = {};
  for (let i = 1; i <= 100; i++) {
    seats[i] = false;
  }

  // Loop through all employees and mark booked seats as true
  employeesData.employees.forEach(emp => {
    emp.reservations.forEach(reservation => {
      const seatNums = reservation.seat_numbers.split(",").map(s => s.trim());
      seatNums.forEach(num => {
        seats[Number(num)] = true;
      });
    });
  });

  res.json(seats);
});
