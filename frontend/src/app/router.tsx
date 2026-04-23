import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Trips from "../pages/Trips";
import TripDetail from "../pages/TripDetail";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  {
    path: "/trips",
    element: (
      <ProtectedRoute>
        <Trips />
      </ProtectedRoute>
    ),
  },
  {
    path: "/trips/:id",
    element: (
      <ProtectedRoute>
        <TripDetail />
      </ProtectedRoute>
    ),
  },
]);
