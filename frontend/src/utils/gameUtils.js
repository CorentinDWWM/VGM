export const formatDateToFrench = (dateString) => {
  const months = {
    Jan: "Janvier",
    Feb: "Février",
    Mar: "Mars",
    Apr: "Avril",
    May: "Mai",
    Jun: "Juin",
    Jul: "Juillet",
    Aug: "Août",
    Sep: "Septembre",
    Oct: "Octobre",
    Nov: "Novembre",
    Dec: "Décembre",
  };

  const parts = dateString.split(" ");
  if (parts.length < 3) return dateString;

  const monthAbbr = parts[0];
  const day = parts[1].replace(",", "");
  const year = parts[2];

  if (!months[monthAbbr] || !day || !year) {
    return dateString;
  }

  return `${parseInt(day)} ${months[monthAbbr]} ${year}`;
};

export const getEarliestReleaseDate = (releaseDates) => {
  if (!releaseDates || releaseDates.length === 0) return null;

  const sortedDates = releaseDates
    .filter((release) => release.date)
    .map((release) => ({
      original: release.date,
      dateObj: new Date(release.date),
    }))
    .sort((a, b) => a.dateObj - b.dateObj);

  return sortedDates.length > 0 ? sortedDates[0].original : null;
};

export const translateText = async (text, targetLang = "fr") => {
  try {
    // Réduire la taille maximale des chunks pour éviter les timeouts
    if (text.length <= 300) {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${targetLang}`
      );
      const data = await response.json();
      return data.responseData.translatedText;
    }

    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > 300) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          const words = sentence.split(" ");
          let wordChunk = "";
          for (const word of words) {
            if ((wordChunk + " " + word).length > 300) {
              if (wordChunk) {
                chunks.push(wordChunk.trim());
                wordChunk = word;
              } else {
                chunks.push(word);
              }
            } else {
              wordChunk += (wordChunk ? " " : "") + word;
            }
          }
          if (wordChunk) {
            currentChunk = wordChunk;
          }
        }
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    const translatedChunks = [];
    for (const chunk of chunks) {
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            chunk
          )}&langpair=en|${targetLang}`
        );
        const data = await response.json();
        translatedChunks.push(data.responseData.translatedText);

        // Réduire le délai entre les requêtes
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        console.error("Erreur lors de la traduction d'un chunk:", error);
        translatedChunks.push(chunk);
      }
    }

    return translatedChunks.join(" ");
  } catch (error) {
    console.error("Erreur de traduction:", error);
    return text;
  }
};
