import { useState, useCallback } from "react";

export const useMediaCache = () => {
  const [mediaCache, setMediaCache] = useState({
    screenshots: [],
    artworks: [],
    videos: [],
  });
  const [isPreloadingMedia, setIsPreloadingMedia] = useState(false);

  const getCacheKey = (gameId) => `game_media_${gameId}`;

  const getCachedMedia = (gameId) => {
    try {
      const cached = localStorage.getItem(getCacheKey(gameId));
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Erreur lors de la lecture du cache:", error);
      return null;
    }
  };

  const setCachedMedia = (gameId, mediaData) => {
    try {
      const allKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("game_media_")
      );
      if (allKeys.length >= 10) {
        const oldestKey = allKeys.sort()[0];
        localStorage.removeItem(oldestKey);
      }

      localStorage.setItem(
        getCacheKey(gameId),
        JSON.stringify({
          ...mediaData,
          timestamp: Date.now(),
          expiresIn: 24 * 60 * 60 * 1000,
        })
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du cache:", error);
    }
  };

  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  };

  const preloadMedia = useCallback(
    async (gameData) => {
      if (!gameData || isPreloadingMedia) return;

      setIsPreloadingMedia(true);

      try {
        const cached = getCachedMedia(gameData.igdbID);
        if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
          setMediaCache(cached);
          setIsPreloadingMedia(false);
          return;
        }

        const mediaToCache = {
          screenshots: [],
          artworks: [],
          videos: [],
        };

        // Précharger les screenshots
        if (gameData.screenshots?.length > 0) {
          const screenshotPromises = gameData.screenshots
            .slice(0, 12)
            .map(async (screenshot) => {
              try {
                const medUrl = `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${screenshot.image_id}.jpg`;
                const bigUrl = `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshot.image_id}.jpg`;

                await Promise.all([preloadImage(medUrl), preloadImage(bigUrl)]);

                return {
                  ...screenshot,
                  medUrl,
                  bigUrl,
                  cached: true,
                };
              } catch (error) {
                console.warn(
                  `Erreur préchargement screenshot ${screenshot.id}:`,
                  error
                );
                return {
                  ...screenshot,
                  cached: false,
                };
              }
            });

          mediaToCache.screenshots = await Promise.all(screenshotPromises);
        }

        // Précharger les artworks
        if (gameData.artworks?.length > 0) {
          const artworkPromises = gameData.artworks
            .slice(0, 12)
            .map(async (artwork) => {
              try {
                const medUrl = `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${artwork.image_id}.jpg`;
                const bigUrl = `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${artwork.image_id}.jpg`;

                await Promise.all([preloadImage(medUrl), preloadImage(bigUrl)]);

                return {
                  ...artwork,
                  medUrl,
                  bigUrl,
                  cached: true,
                };
              } catch (error) {
                console.warn(
                  `Erreur préchargement artwork ${artwork.id}:`,
                  error
                );
                return {
                  ...artwork,
                  cached: false,
                };
              }
            });

          mediaToCache.artworks = await Promise.all(artworkPromises);
        }

        // Précharger les miniatures des vidéos
        if (gameData.videos?.length > 0) {
          const videoPromises = gameData.videos
            .slice(0, 8)
            .map(async (video) => {
              try {
                const thumbnailUrl = `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`;
                await preloadImage(thumbnailUrl);

                return {
                  ...video,
                  thumbnailUrl,
                  cached: true,
                };
              } catch (error) {
                console.warn(`Erreur préchargement vidéo ${video.id}:`, error);
                return {
                  ...video,
                  cached: false,
                };
              }
            });

          mediaToCache.videos = await Promise.all(videoPromises);
        }

        setMediaCache(mediaToCache);
        setCachedMedia(gameData.igdbID, mediaToCache);
      } catch (error) {
        console.error("Erreur lors du préchargement des médias:", error);
      } finally {
        setIsPreloadingMedia(false);
      }
    },
    [isPreloadingMedia]
  );

  const getImageUrl = (item, type, size = "med") => {
    const sizeKey = size === "med" ? "medUrl" : "bigUrl";
    const sizeParam = size === "med" ? "t_screenshot_med" : "t_screenshot_big";

    if (type === "screenshot" || type === "artwork") {
      const cachedItem = mediaCache[`${type}s`]?.find(
        (cached) => cached.id === item.id
      );
      if (cachedItem?.cached && cachedItem[sizeKey]) {
        return cachedItem[sizeKey];
      }
      return `https://images.igdb.com/igdb/image/upload/${sizeParam}/${item.image_id}.jpg`;
    }

    if (type === "video") {
      const cachedItem = mediaCache.videos?.find(
        (cached) => cached.id === item.id
      );
      if (cachedItem?.cached && cachedItem.thumbnailUrl) {
        return cachedItem.thumbnailUrl;
      }
      return `https://img.youtube.com/vi/${item.video_id}/maxresdefault.jpg`;
    }
  };

  return {
    mediaCache,
    isPreloadingMedia,
    preloadMedia,
    getImageUrl,
  };
};
