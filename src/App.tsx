import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FallingBlossoms from './components/FallingBlossoms';
import Home from './pages/Home';
import Download from './pages/Download';
import Register from './pages/Register';
import Rankings from './pages/Rankings';
import Login from './pages/Login';
import Account from './pages/Account';
import ForgotUsername from './pages/ForgotUsername';
import ResetPassword from './pages/ResetPassword';
import ResetPIC from './pages/ResetPIC';
import SkillCalculator from './pages/SkillCalculator';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <FallingBlossoms />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/download" element={<Download />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/forgot-username" element={<ForgotUsername />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-pic" element={<ResetPIC />} />
            <Route path="/skills" element={<SkillCalculator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
