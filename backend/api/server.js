require("dotenv").config();

const { createApp } = require("./createApp");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

async function startServer() {
  try {
    console.log("Connecting MongoDB...");
    await connectDB();
    console.log("MongoDB Connected Successfully");

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`
========================================
 Magical Herbal Care Backend Running
 Environment : ${NODE_ENV}
 Port        : ${PORT}
 Health URL  : http://localhost:${PORT}/api/health
========================================
      `);
    });

    server.on("error", (error) => {
      console.error("Server runtime error:", error.message);
    });
  } catch (error) {
    console.error("Server start error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

/* Handle unhandled promise rejection */
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error.message);
});

/* Handle uncaught exception */
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
});

startServer();