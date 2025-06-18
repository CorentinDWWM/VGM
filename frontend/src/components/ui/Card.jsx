export const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-md bg-secondary p-1 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
