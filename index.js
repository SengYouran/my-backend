require("dotenv").config();

const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("CRASH:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("PROMISE ERROR:", err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});