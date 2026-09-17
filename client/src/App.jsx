import { Routes, Route, useLocation } from "react-router";

import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Overview from "./pages/dashboard/Overview";
import Subjects from "./pages/dashboard/Subjects";
import Tutors from "./pages/dashboard/Tutors";
import BookSession from "./pages/dashboard/BookSession";
import MySessions from "./pages/dashboard/MySessions";
import Profile from "./pages/dashboard/Profile";

import TutorSchedule from "./pages/TutorSchedule";
import BookingReview from "./pages/BookingReview";

function App() {
  const location = useLocation();

  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <>
      {isDashboardPage ? <DashboardNavbar /> : <Navbar />}

      <main
        className={
          isDashboardPage
            ? "min-h-screen bg-slate-50"
            : "mx-auto max-w-6xl px-6"
        }>
        <div className={isDashboardPage ? "mx-auto max-w-7xl px-6" : ""}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Overview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/subjects"
              element={
                <ProtectedRoute>
                  <Subjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/tutors"
              element={
                <ProtectedRoute>
                  <Tutors />
                </ProtectedRoute>
              }
            />

          
            <Route
              path="/dashboard/tutors/:tutorId/schedule"
              element={
                <ProtectedRoute>
                  <TutorSchedule />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/book"
              element={
                <ProtectedRoute>
                  <BookSession />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/booking/review"
              element={
                <ProtectedRoute>
                  <BookingReview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/sessions"
              element={
                <ProtectedRoute>
                  <MySessions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <section className="py-20 text-center">
                  <h1 className="text-3xl font-bold text-blue-950">
                    Page not found
                  </h1>
                </section>
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
