const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/students", (req, res) => {
  res.json([
    { id: 1, name: "John Doe", course: "Computer Science" },
    { id: 2, name: "Jane Smith", course: "Information Technology" }
  ]);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
