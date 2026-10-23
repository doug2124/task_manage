const express = require("express");
const cors = require("cors");

const generateRoute = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", generateRoute);

const server = app.listen(3000, () => {
  console.log("Server running");
});
console.log(server.address());