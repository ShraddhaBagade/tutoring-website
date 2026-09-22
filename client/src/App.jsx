import { Routes, Route, useLocation } from "react-router";

import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BecomeTutor from "./pages/BecomeTutor";
import ActivateTutorAccount from "./pages/ActivateTutorAccount";

import Overview from "./pages/dashboard/Overview";
import Subjects from "./pages/dashboard/Subjects";
import Tutors from "./pages/dashboard/Tutors";
import BookSession from "./pages/dashboard/BookSession";
import MySessions from "./pages/dashboard/MySessions";
import MyAssignments from "./pages/dashboard/MyAssignments";
import MyClassNotes from "./pages/dashboard/MyClassNotes";
import Profile from "./pages/dashboard/Profile";

import TutorSchedule from "./pages/TutorSchedule";
import BookingReview from "./pages/BookingReview";

import TutorDashboard from "./pages/dashboard/TutorDashboard";
import ManageAvailability from "./pages/dashboard/ManageAvailability";
import TutorAssignments from "./pages/dashboard/TutorAssignments";
import TutorLessonNotes from "./pages/dashboard/TutorLessonNotes";

import AdminTutorApplications from "./pages/dashboard/AdminTutorApplications";

function App() {
  const location = useLocation();

  const isDashboardPage = location.pathname.startsWith("/dashboard");

  const studentAccountTypes = ["student", "parent", "admin"];

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
        <div className={isDashboardPage ? "mx-auto max-w-7xl px-6" : ""}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/become-a-tutor" element={<BecomeTutor />} />

            <Route
              path="/activate-tutor-account"
              element={<ActivateTutorAccount />}
            />

            {/* Student routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <Overview />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/subjects"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <Subjects />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/tutors"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <Tutors />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/tutors/:tutorId/schedule"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <TutorSchedule />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/book"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <BookSession />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/booking/review"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <BookingReview />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/sessions"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <MySessions />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/assignments"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <MyAssignments />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/class-notes"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <MyClassNotes />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={studentAccountTypes}>
                    <Profile />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Tutor routes */}
            <Route
              path="/dashboard/tutor"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={["tutor"]}>
                    <TutorDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/tutor/availability"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={["tutor"]}>
                    <ManageAvailability />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/tutor/assignments"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={["tutor"]}>
                    <TutorAssignments />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/tutor/lesson-notes"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={["tutor"]}>
                    <TutorLessonNotes />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/dashboard/admin/tutors"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedAccountTypes={["admin"]}>
                    <AdminTutorApplications />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Unknown routes */}
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