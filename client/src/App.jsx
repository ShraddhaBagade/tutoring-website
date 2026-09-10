import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="*"
            element={<h1 className="py-10 text-3xl">Page not found</h1>}
          />
        </Routes>
      </main>

       <Footer />
    </>
  );
}

export default App;
