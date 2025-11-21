const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Home page!");
});

app.get("/profile", (req, res) => {
  res.send({ name: "Omar", role: "Cloud & DevOps Student" });
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
