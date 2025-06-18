export const Button = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const base = "rounded-xl px-4 py-2 font-medium transition-colors";
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900",
    outline:
      "border border-gray-300 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
  };
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
