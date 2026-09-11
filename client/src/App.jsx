import {
  Routes,
  Route,
  useLocation,
} from "react-router";

import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TutorSchedule from "./pages/TutorSchedule";
import BookingReview from "./pages/BookingReview";

function App() {
  const location = useLocation();

  const isDashboardPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/tutors/") ||
    location.pathname.startsWith("/booking/");

  return (
    <>
      {isDashboardPage ? <DashboardNavbar /> : <Navbar />}

      <main
        className={
          isDashboardPage
            ? "min-h-screen bg-slate-50"
            : "mx-auto max-w-6xl px-6"
        }
      >
        <div
          className={
            isDashboardPage
              ? "mx-auto max-w-6xl px-6"
              : ""
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tutors/:tutorId/schedule"
              element={
                <ProtectedRoute>
                  <TutorSchedule />
                </ProtectedRoute>
              }
            />

            <Route
              path="/booking/review"
              element={
                <ProtectedRoute>
                  <BookingReview />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <h1 className="py-10 text-3xl">
                  Page not found
                </h1>
              }
            />
          </Routes>
        </div>
      </main>

      {!isDashboardPage && <Footer />}
    </>
  );
}

export default App;