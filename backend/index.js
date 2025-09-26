require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const __DIRNAME = path.resolve();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    // origin: "*",
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.static(path.join(__DIRNAME, "/frontend/dist")));

const routes = require("./routes");

app.use(routes);

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__DIRNAME, "frontend/dist")));

// Route catch-all pour SPA - doit être après les routes API et les fichiers statiques
app.get(/.*/, (req, res) => {
  // Vérifier si la requête est pour un fichier statique
  if (req.path.includes(".")) {
    return res.status(404).send("File not found");
  }

  res.sendFile(path.join(__DIRNAME, "frontend", "dist", "index.html"));
});

// Configuration optimisée de la connexion MongoDB
const mongoOptions = {
  maxPoolSize: 10, // Limite le nombre de connexions simultanées
  serverSelectionTimeoutMS: 5000, // Timeout de sélection du serveur
  socketTimeoutMS: 45000, // Timeout des sockets
};

// Gestion optimisée de la connexion MongoDB
const connectDB = async () => {
  try {
    console.log("🔄 Connexion à MongoDB en cours...");
    await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    console.log("✅ Connexion MongoDB réussie");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error.message);
    process.exit(1);
  }
};

// Connexion à la base de données
connectDB();

// Gestion des événements de connexion
mongoose.connection.on("error", (err) => {
  console.error("❌ Erreur MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB déconnecté");
});

app.listen(3000, () => {
  console.log("🚀 Serveur démarré sur le port 3000");
});

// localhost:3000
