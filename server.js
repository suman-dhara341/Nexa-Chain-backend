const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const userRoutes = require("./routes/userRoutes");
const { startCronJob } = require("./services/cronJob");
const connectDB = require("./config/db");

const app = express();

connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

startCronJob();

app.get("/", (req, res) => {
  res.send("Nexa Chain Backend is running safely");
});

app.use("/api/auth", authRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const backendUrl = process.env.RENDER_EXTERNAL_URL;
  const protocol = backendUrl.startsWith("https") ? https : http;

  setInterval(
    () => {
      protocol
        .get(backendUrl, (resp) => {
          if (resp.statusCode === 200) {
            console.log(
              `[Keep-Alive] Server pinged successfully at ${new Date().toLocaleTimeString()}`,
            );
          }
        })
        .on("error", (err) => {
          console.log("[Keep-Alive] Ping Failed: " + err.message);
        });
    },
    14 * 60 * 1000,
  );
});
