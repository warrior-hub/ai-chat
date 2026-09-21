import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Auth check chal raha hai
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />

          <p className="text-sm text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Login nahi hai
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Login hai
  return <Outlet />;
};

export default ProtectedRoute;