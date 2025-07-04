const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmation d'inscription",
    html: `<p>Bienvenue sur notre site ! Cliquez sur le lien suivant pour confirmer l'inscription : <a href="${process.env.API_URL}/user/verifyMail/${token}">Confirmer l'inscription</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendValidationAccount = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Inscription validée",
    html: `<p>Bienvenue sur notre site ! Cliquez sur le lien suivant pour vous connecter : <a href="${process.env.CLIENT_URL}/login">Se connecter</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendInvalidEmailToken = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Problème lors de la validation",
    html: `<p>Token expiré ! Veuillez vous réinscrire : <a href="${process.env.CLIENT_URL}/register">S'inscrire</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendForgotPassword = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Oublie de mot de passe",
    html: `<p>Cliquez sur le lien suivant pour redéfinir un mot de passe : <a href="${process.env.CLIENT_URL}/resetpassword/${token}">Réinitialisation de mot de passe</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordReset = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation mot de passe",
    html: `<p>Mot de passe réinitialisé ! Vous pouvez maintenant vous connecter : <a href="${process.env.CLIENT_URL}/login">Se connecter</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
  sendForgotPassword,
  sendPasswordReset,
};
