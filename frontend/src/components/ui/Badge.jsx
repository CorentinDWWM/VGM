export function Badge({ status, children, className = "" }) {
  const colors = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    neutral: "bg-yellow-600 text-white",
  };
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
        colors[status] || "bg-gray-300 text-black"
      } ${className}`}
    >
      {children}
    </span>
  );
}
