const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
  sendForgotPassword,
  sendPasswordReset,
} = require("../email/email");
const TempUser = require("../models/tempuser.schema");
const { default: cloudinary } = require("../lib/cloudinary");
const Game = require("../models/games.schema");

const SECRET_KEY = process.env.SECRET_KEY;

const createTokenEmail = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "300s" });
};
const createTokenResetPassword = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "300s" });
};

const signup = async (req, res) => {
  try {
    // on déstructure les données reçues depuis l'application frontend
    const { username, email, password } = req.body;

    // vérification si ce mail est déjà présent
    const user = await User.findOne({ email });

    // si oui retour d'un message avec un status d'erreur
    if (user) {
      return res.status(400).json({ message: "Déjà inscrit" });
    }

    // création d'un token
    const token = createTokenEmail(email);

    // Essayer d’envoyer l’email APRÈS sauvegarde
    try {
      await sendConfirmationEmail(email, token);
      console.log("📧 Email envoyé avec SendGrid à:", email);
    } catch (mailError) {
      console.error(
        "⚠️ Erreur envoi email:",
        mailError.response?.body || mailError
      );
      // On n’empêche pas la réponse côté client
    }

    // on crée un nouvel utilisateur conforme au schéma
    // On hash le mot de passe avec bcrypt
    const tempUser = new TempUser({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      token,
    });
    // on sauvegarde cet utilisateur en BDD
    await tempUser.save();
    // on retourne l'utilisateur
    res.status(201).json({
      messageOk:
        "Veuillez confirmer votre inscription en consultant votre boite mail",
    });
  } catch (error) {
    console.log(error);
  }
};

// vérification de mail
const verifyMail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const tempUser = await TempUser.findOne({ email: decoded.email, token });
    if (!tempUser) {
      return res.redirect(`${process.env.CLIENT_URL}/register?message=error`);
    }
    const newUser = new User({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
    });
    await newUser.save();
    await TempUser.deleteOne({ email: tempUser.email });
    await sendValidationAccount(decoded.email);
    res.redirect(`${process.env.CLIENT_URL}/login?message=success`);
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const tempUser = await TempUser.findOne({ token });
      if (tempUser) {
        await tempUser.deleteOne({ token });
        await sendInvalidEmailToken(tempUser.email);
      }
      return res.redirect(`${process.env.CLIENT_URL}/register?message=error`);
    }
  }
};

const signin = async (req, res) => {
  try {
    // récupération des données envoyées depuis l'application Web
    const { username, password } = req.body;

    // vérification que l'utilisateur existe
    const user = await User.findOne({ username });

    // si non feedback non explicite
    if (!user) {
      return res
        .status(400)
        .json({ message: "Pseudo et/ou mot de passe incorrect" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password: _, ...userWithoutPassword } = user.toObject();
      const token = jwt.sign({}, SECRET_KEY, {
        subject: user.id.toString(),
        expiresIn: "7d",
        algorithm: "HS256",
      });

      // Configuration des cookies sécurisés
      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // HTTPS en production
        sameSite: isProduction ? "None" : "Lax", // 'None' pour les requêtes cross-origin en production
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined, // Domaine spécifique en production
      });

      res.status(200).json(userWithoutPassword);
    } else {
      res.status(400).json({ message: "Pseudo et/ou mot de passe incorrect" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Mot de passe oublié
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = createTokenResetPassword(email);
      await sendForgotPassword(email, token);
      res.json({ message: "Modification en cours ..." });
    } else {
      res.status(400).json({ message: "Email inexistant en base de données" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// réiniatilisation de mot de passe
const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const updatedUser = await User.findOne({
      email: decoded.email,
    });
    const newUser = new User({
      username: updatedUser.username,
      email: updatedUser.email,
      password: hashPassword,
    });
    await sendPasswordReset(updatedUser.email);
    await newUser.save();
    res.status(201).json({
      messageOk:
        "Votre mot de passe a bien été modifié ! Vous pouvez maintenant vous connecter",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// méthodes pour mettre à jour les utilisateurs

const updateUser = async (req, res) => {
  try {
    // récupération en déstructurant les données reçues depuis l'application web
    const { _id, username, email } = req.body;

    // mise à jour sur l'utilisateur qui a cet id, on précise les champs que l'on modifie et la dernière option permet de récupérer l'objet modifié
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        username,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Token manquant",
      });
    }

    const decodedToken = jwt.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;

    if (!avatar) {
      return res.status(400).json({
        message: "Avatar requis",
      });
    }

    let avatarUrl = avatar;

    // Si c'est une image en base64, l'uploader sur cloudinary
    if (avatar.startsWith("data:image/")) {
      const uploadResponse = await cloudinary.uploader.upload(avatar);
      avatarUrl = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: avatarUrl,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const { password: _, ...userWithoutPassword } = updatedUser.toObject();

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log("error in update avatar", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};

const currentUser = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY);
      const currentUser = await User.findById(decodedToken.sub);
      if (currentUser) {
        res.status(200).json(currentUser);
      } else {
        res.json(null);
      }
    } catch (error) {
      res.json(null);
    }
  } else {
    res.json(null);
  }
};

const logoutUser = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
  });
  res.status(200).json({ message: "Déconnexion réussie" });
};

const updateGameInUser = async (req, res) => {
  try {
    const { game, user } = req.body;

    // Vérifications des données reçues
    if (!user || !user._id) {
      return res
        .status(400)
        .json({ error: "Utilisateur manquant ou invalide" });
    }

    if (!game) {
      return res.status(400).json({ error: "Jeu manquant" });
    }

    // Vérification et gestion de user.games
    if (user.games !== undefined && !Array.isArray(user.games)) {
      return res
        .status(400)
        .json({ error: "Le champ games doit être un tableau" });
    }

    // Utilisation défensive : tableau vide si games n'existe pas ou n'est pas un tableau
    const currentGames = Array.isArray(user.games) ? user.games : [];

    // Optionnel : vérifier les doublons
    const gameExists = currentGames.some(
      (existingGame) => existingGame.igdbID === game.igdbID
    );

    if (gameExists) {
      return res
        .status(409)
        .json({ error: "Ce jeu existe déjà pour cet utilisateur" });
    }

    const gameWithTimestamp = {
      ...game,
      addedAtUser: new Date(),
    };

    const gameWithTimePlayed = {
      ...gameWithTimestamp,
      timePlayed: 0,
    };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        games: [...currentGames, gameWithTimePlayed],
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Succès", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

const deleteGameInUser = async (req, res) => {
  try {
    const { game, user } = req.body;

    // Vérifications des données reçues
    if (!user || !user._id) {
      return res
        .status(400)
        .json({ error: "Utilisateur manquant ou invalide" });
    }

    if (!game) {
      return res.status(400).json({ error: "Jeu manquant" });
    }

    // Vérification et gestion de user.games
    if (user.games !== undefined && !Array.isArray(user.games)) {
      return res
        .status(400)
        .json({ error: "Le champ games doit être un tableau" });
    }

    // Utilisation défensive : tableau vide si games n'existe pas ou n'est pas un tableau
    const currentGames = Array.isArray(user.games) ? user.games : [];

    // Filtrer le jeu à supprimer
    const updatedGames = currentGames.filter(
      (existingGame) => existingGame.igdbID !== game.igdbID
    );

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        games: updatedGames,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Succès", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

const updateGameStatusInUser = async (req, res) => {
  try {
    const { game, newStatus, user } = req.body;

    // Vérifications des données reçues
    if (!user || !user._id) {
      return res
        .status(400)
        .json({ error: "Utilisateur manquant ou invalide" });
    }

    if (!game) {
      return res.status(400).json({ error: "Jeu manquant" });
    }

    if (!newStatus) {
      return res.status(400).json({ error: "Nouveau statut manquant" });
    }

    // Vérification et gestion de user.games
    if (user.games !== undefined && !Array.isArray(user.games)) {
      return res
        .status(400)
        .json({ error: "Le champ games doit être un tableau" });
    }

    // Mise à jour du statut du jeu dans le tableau games
    const updatedGames = user.games.map((g) =>
      g.igdbID === game.igdbID ? { ...g, statusUser: newStatus } : g
    );

    // Vérifier s'il y a eu un changement
    const gameFound = user.games.some((g) => g.igdbID === game.igdbID);
    if (!gameFound) {
      return res
        .status(404)
        .json({ error: "Jeu non trouvé dans la liste de l'utilisateur" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        games: updatedGames,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Succès", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

const migrateUserGamesReleaseDates = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs qui ont des jeux
    const users = await User.find({ games: { $exists: true, $ne: [] } });
    console.log(`🔍 Trouvé ${users.length} utilisateurs avec des jeux`);

    let updatedUsersCount = 0;
    let updatedGamesCount = 0;

    for (const user of users) {
      let hasUpdates = false;
      const updatedGames = [];

      for (const userGame of user.games) {
        console.log(
          `🎮 Traitement du jeu igdbID: ${
            userGame.igdbID
          } (type: ${typeof userGame.igdbID})`
        );

        // Vérifier si le jeu a déjà des release_dates
        if (!userGame.release_dates) {
          // Chercher le jeu dans la collection games par igdbID
          const gameFromDB = await Game.findOne({ igdbID: userGame.igdbID });
          console.log(`📊 Jeu trouvé en DB: ${gameFromDB ? "Oui" : "Non"}`);

          if (gameFromDB && gameFromDB.release_dates) {
            // Ajouter les release_dates au jeu de l'utilisateur
            updatedGames.push({
              ...userGame,
              release_dates: gameFromDB.release_dates,
            });
            hasUpdates = true;
            updatedGamesCount++;
            console.log(`✅ Release dates ajoutées pour ${gameFromDB.name}`);
          } else {
            // Garder le jeu tel quel s'il n'y a pas de release_dates dans la DB
            updatedGames.push(userGame);
          }
        } else {
          // Garder le jeu tel quel s'il a déjà des release_dates
          updatedGames.push(userGame);
        }
      }

      // Mettre à jour l'utilisateur seulement s'il y a des changements
      if (hasUpdates) {
        await User.findByIdAndUpdate(user._id, { games: updatedGames });
        updatedUsersCount++;
        console.log(`👤 Utilisateur ${user.username} mis à jour`);
      }
    }

    res.status(200).json({
      message: "Migration terminée avec succès",
      updatedUsers: updatedUsersCount,
      updatedGames: updatedGamesCount,
    });
  } catch (error) {
    console.error("Erreur lors de la migration:", error);
    res.status(500).json({
      error: "Erreur lors de la migration des release_dates",
      details: error.message,
    });
  }
};

// Nouvelle fonction pour gérer les préférences de cookies
const updateCookiePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decodedToken = jwt.verify(token, SECRET_KEY);
    const userId = decodedToken.sub;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        cookiePreferences: preferences,
        cookieConsentDate: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Préférences de cookies mises à jour",
      preferences: updatedUser.cookiePreferences,
    });
  } catch (error) {
    console.log("Erreur mise à jour préférences cookies:", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
};

module.exports = {
  signup,
  signin,
  updateUser,
  updateAvatar,
  currentUser,
  logoutUser,
  verifyMail,
  forgotPassword,
  resetPassword,
  updateGameInUser,
  deleteGameInUser,
  updateGameStatusInUser,
  migrateUserGamesReleaseDates,
  updateCookiePreferences,
};
