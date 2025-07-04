import { BASE_URL } from "../utils/url";

export async function signin(values) {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    const userConnected = await response.json();
    // soit on récupère un utilisateur, soit un message
    return userConnected;
  } catch (error) {
    console.log(error);
  }
}

export async function signup(values) {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
    });
    const message = await response.json();
    console.log(message);

    return message;
  } catch (error) {
    console.log(error);
  }
}

// Mot de passe oublié
export async function passwordForgotten(values) {
  console.log(values);
  try {
    const response = await fetch(`${BASE_URL}/user/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: values }),
    });
    const message = await response.json();
    return message;
  } catch (error) {
    console.error(error);
  }
}

// Réiniatilisation du mot de passe
export async function passwordReset(values) {
  console.log(values);
  try {
    const response = await fetch(`${BASE_URL}/user/resetPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const message = await response.json();
    return message;
  } catch (error) {
    console.error(error);
  }
}

// méthodes update (même système que requête POST, seul le verbe change)

export async function update(values) {
  const user = {
    _id: values._id,
    email: values.email,
    username: values.username,
  };
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json",
      },
    });
    const updatedUser = await response.json();

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function updateAvatar(values) {
  try {
    const response = await fetch(`${BASE_URL}/user/avatar`, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
    });
    const updatedUserAvatar = await response.json();

    return updatedUserAvatar;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${BASE_URL}/user/currentUser`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function signOut() {
  await fetch(`${BASE_URL}/user/deleteToken`, {
    method: "DELETE",
    credentials: "include",
  });
}
