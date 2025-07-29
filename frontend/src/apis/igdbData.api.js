import { BASE_URL } from "../utils/url";

export async function getGames(limit, skip) {
  try {
    const response = await fetch(
      `${BASE_URL}/igdb/games?limit=${limit}&skip=${skip}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getGenres() {
  try {
    const response = await fetch(`${BASE_URL}/igdb/genres`, {
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

export async function getThemes() {
  try {
    const response = await fetch(`${BASE_URL}/igdb/themes`, {
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

export async function getKeywords() {
  try {
    const response = await fetch(`${BASE_URL}/igdb/keywords`, {
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

export async function getPlateformes() {
  try {
    const response = await fetch(`${BASE_URL}/igdb/plateformes`, {
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
