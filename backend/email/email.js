const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

dotenv = require("dotenv");
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const sendConfirmationEmail = async (email, token) => {
  const msg = {
    from: process.env.SENDGRID_SENDER,
    to: email,
    subject: "Confirmation d'inscription",
    html: `<p>Bienvenue sur notre site ! Cliquez sur le lien suivant pour confirmer l'inscription : <a href="${process.env.API_URL}/user/verifyMail/${token}">Confirmer l'inscription</a></p>`,
  };
  // await transporter.sendMail(mailOptions);

  try {
    await sgMail.send(msg);
    console.log("✅ Mail envoyé à " + email);
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);

    if (error.response) {
      console.error(error.response.body); // détails de SendGrid
    }
  }
};

const sendValidationAccount = async (email) => {
  const msg = {
    from: process.env.SENDGRID_SENDER,
    to: email,
    subject: "Inscription validée",
    html: `<p>Bienvenue sur notre site ! Cliquez sur le lien suivant pour vous connecter : <a href="${process.env.CLIENT_URL}/login">Se connecter</a></p>`,
  };

  // await transporter.sendMail(mailOptions);

  try {
    await sgMail.send(msg);
    console.log("✅ Mail envoyé à " + email);
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);

    if (error.response) {
      console.error(error.response.body); // détails de SendGrid
    }
  }
};

const sendInvalidEmailToken = async (email) => {
  const msg = {
    from: process.env.SENDGRID_SENDER,
    to: email,
    subject: "Problème lors de la validation",
    html: `<p>Token expiré ! Veuillez vous réinscrire : <a href="${process.env.CLIENT_URL}/register">S'inscrire</a></p>`,
  };

  // await transporter.sendMail(mailOptions);

  try {
    await sgMail.send(msg);
    console.log("✅ Mail envoyé à " + email);
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);

    if (error.response) {
      console.error(error.response.body); // détails de SendGrid
    }
  }
};

const sendForgotPassword = async (email, token) => {
  const msg = {
    from: process.env.SENDGRID_SENDER,
    to: email,
    subject: "Oublie de mot de passe",
    html: `<p>Cliquez sur le lien suivant pour redéfinir un mot de passe : <a href="${process.env.CLIENT_URL}/resetpassword/${token}">Réinitialisation de mot de passe</a></p>`,
  };

  // await transporter.sendMail(mailOptions);

  try {
    await sgMail.send(msg);
    console.log("✅ Mail envoyé à " + email);
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);

    if (error.response) {
      console.error(error.response.body); // détails de SendGrid
    }
  }
};

const sendPasswordReset = async (email) => {
  const msg = {
    from: process.env.SENDGRID_SENDER,
    to: email,
    subject: "Réinitialisation mot de passe",
    html: `<p>Mot de passe réinitialisé ! Vous pouvez maintenant vous connecter : <a href="${process.env.CLIENT_URL}/login">Se connecter</a></p>`,
  };

  // await transporter.sendMail(mailOptions);

  try {
    await sgMail.send(msg);
    console.log("✅ Mail envoyé à " + email);
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);

    if (error.response) {
      console.error(error.response.body); // détails de SendGrid
    }
  }
};

module.exports = {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
  sendForgotPassword,
  sendPasswordReset,
};
