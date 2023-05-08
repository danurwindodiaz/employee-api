const express = require("express");

const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:4200"];

app.use(
  cors({
    origin: function (origin, callback) {
      // memeriksa apakah origin termasuk dalam daftar allowedOrigins
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.listen(3000, () => console.log("Server running in port 3000"));

let data = JSON.parse(fs.readFileSync("db.json"));

// Mengambil semua data employee
app.get("/api/employee", (req, res) => {
  res.send(data.employees);
});

// Mengambil single data employee
app.get("/api/employee/:id", (req, res) => {
  const id = req.params.id;
  const employees = data.employees;
  let employee = employees.find((employees) => employees.id === id);
  if (employee) {
    res.send(employee);
  } else {
    res.send("Data not found!");
  }
});

// Menambahkan data employee
app.post("/api/employee", (req, res) => {
  const body = req.body;
  data.employees.push(body);
  fs.writeFileSync("db.json", JSON.stringify(data, null));
  res.send("Employee has been added");
});

// Mengubah data employee
app.put("/api/employee", (req, res) => {
  const id = req.body.id;
  const employees = data.employees;
  let employee = employees.find((employees) => employees.id === id);
  employee.name = req.body.name;
  employee.department = req.body.department;
  fs.writeFileSync("db.json", JSON.stringify(data, null));
  res.send("Employee has been updated");
});

// Menghapus data user
app.delete("/api/employee/:id", (req, res) => {
  const id = req.params.id;
  const employees = data.employees;
  let index = employees.findIndex((employees) => employees.id === id);
  data.employees.splice(index, 1);
  res.send("Employee has been deleted");
});
