// node utils/generateTwitchAccessToken.js

const token = [];

const generateToken = async () => {
  try {
    const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "sm0qoewzus6pd6ahxogwkvx6dfaz9z",
        client_secret: "bi3dzpo8l2qwnkuo04q6goe3wuzh5b",
        grant_type: "client_credentials",
      }),
    });

    const data = await response.json();
    token.push(data);
    console.log(token);
  } catch (error) {
    console.log(error);
  }
};

generateToken(); // Appel de la fonction
