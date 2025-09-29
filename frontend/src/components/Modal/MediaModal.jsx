import { useEffect } from "react";

export default function MediaModal({
  isOpen,
  modalType,
  currentIndex,
  mediaData,
  gameName,
  onClose,
  onNavigate,
}) {
  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onNavigate("prev");
          break;
        case "ArrowRight":
          onNavigate("next");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !mediaData || mediaData.length === 0) {
    return null;
  }

  const currentMedia = mediaData[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fond flou */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Contenu de la modal */}
      <div
        className={`relative z-10 mx-4 flex items-center ${
          modalType === "video"
            ? "w-full max-w-6xl h-full max-h-[90vh]"
            : "max-w-7xl max-h-[90vh]"
        }`}
      >
        {modalType === "screenshot" && (
          <img
            src={`https://images.igdb.com/igdb/image/upload/t_1080p/${currentMedia.image_id}.jpg`}
            alt={`Screenshot ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        )}

        {modalType === "artwork" && (
          <img
            src={`https://images.igdb.com/igdb/image/upload/t_1080p/${currentMedia.image_id}.jpg`}
            alt={`Artwork ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        )}

        {modalType === "video" && (
          <div className="w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${currentMedia.video_id}?autoplay=1`}
              title={`${gameName} - Video ${currentIndex + 1}`}
              className="w-full h-full rounded-lg shadow-2xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Flèches de navigation */}
        {mediaData.length > 1 && (
          <>
            <button
              onClick={() => onNavigate("prev")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => onNavigate("next")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Indicateur de position */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {mediaData.length}
        </div>
      </div>
    </div>
  );
}
