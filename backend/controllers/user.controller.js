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

const SECRET_KEY = process.env.SECRET_KEY;

const createTokenEmail = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "300s" });
};
const createTokenResetPassword = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "300s" });
};

const signup = async (req, res) => {
  try {
    // on déstructure les données reçues depuis l'application front (REACT)
    const { username, email, password } = req.body;

    // vérification si ce mail est déjà présent
    const user = await User.findOne({ email });

    // si oui retour d'un message avec un status d'erreur
    if (user) {
      return res.status(400).json({ message: "Déjà inscrit" });
    }

    // création d'un token
    const token = createTokenEmail(email);

    // envoi d'email
    await sendConfirmationEmail(email, token);

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
      // on déstructure pour récupérer un objet sans le mot de passe
      const { password: _, ...userWithoutPassword } = user.toObject();
      const token = jwt.sign({}, SECRET_KEY, {
        subject: user.id.toString(),
        expiresIn: "7d",
        algorithm: "HS256",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
    const { _id, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatar,
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
  });
  res.status(200).json({ message: "Déconnexion réussie" });
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
};
