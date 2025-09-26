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

export const getGamesSimplified = async () => {
  try {
    const response = await fetch(`${BASE_URL}/igdb/gamesForSearch`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Game not found");
    }
  } catch (error) {
    console.log(error);
  }
};

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

export const importGamesThisWeek = async () => {
  try {
    const response = await fetch(`${BASE_URL}/igdb/games/import/this-week`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Import failed for this week games");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const importGamesThisMonth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/igdb/games/import/this-month`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Import failed for this month games");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const importGamesLastThreeMonths = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/igdb/games/import/last-three-months`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Import failed for last three months games");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
