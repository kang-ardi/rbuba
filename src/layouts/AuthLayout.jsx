export default function AuthLayout({ children }) {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3"
    >
      <div className="auth-wrapper w-100">
        {children}
      </div>
    </div>
  );
}