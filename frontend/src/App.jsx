import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route
            path="/chat"
            element={<Chat />}
          />
        </Route>

        {/* Default */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;