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

export const getGameById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/igdb/games/${id}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Game not found");
    }
  } catch (error) {
    console.log(error);
  }
};
