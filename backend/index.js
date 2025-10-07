require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression"); // Ajouter cette ligne
const path = require("path");

const __DIRNAME = path.resolve();

const app = express();

// Ajouter la compression avant les autres middlewares
app.use(
  compression({
    level: 6, // Niveau de compression (1-9)
    threshold: 1000, // Compresser seulement si > 1KB
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Configuration CORS améliorée pour les cookies
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: function (origin, callback) {
      // Permettre les requêtes sans origin (applications mobiles, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:5173", // Vite dev server
        "http://localhost:3000", // Dev local
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Non autorisé par CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Essentiel pour les cookies cross-origin
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Headers de sécurité supplémentaires
app.use((req, res, next) => {
  // Permettre les cookies cross-origin
  res.header("Access-Control-Allow-Credentials", "true");

  // Headers de sécurité
  if (isProduction) {
    res.header(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
  }

  next();
});

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
