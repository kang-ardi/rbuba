import useAuth from "../../hooks/useAuth";

export default function TestAuth() {
  const { user, profile, role, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="container py-5">
      <h3>Auth Test</h3>

      <hr />

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <hr />

      <pre>{JSON.stringify(profile, null, 2)}</pre>

      <hr />

      <h4>Role : {role || "-"}</h4>
    </div>
  );
}