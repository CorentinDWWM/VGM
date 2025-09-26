import { BASE_URL } from "../utils/url";

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

export async function getGamesByGenre(genreId) {
  try {
    const response = await fetch(`${BASE_URL}/igdb/genres/${genreId}/games`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getGamesByGenrePaginated(genreId, limit = 50, skip = 0) {
  try {
    const response = await fetch(
      `${BASE_URL}/igdb/genres/${genreId}/games/paginated?limit=${limit}&skip=${skip}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getGamesByPlatform(platformId) {
  try {
    const response = await fetch(
      `${BASE_URL}/igdb/plateformes/${platformId}/games`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getGamesByPlatformPaginated(
  platformId,
  limit = 50,
  skip = 0
) {
  try {
    const response = await fetch(
      `${BASE_URL}/igdb/plateformes/${platformId}/games/paginated?limit=${limit}&skip=${skip}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
