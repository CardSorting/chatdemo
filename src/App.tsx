import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import MainNav from "./components/layout/MainNav";
import LoginPage from "./components/auth/LoginPage";
import UserProfile from "./components/user/UserProfile";
import ExplorePage from "./components/explore/ExplorePage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./components/admin/AdminLoginPage";
import UsersPage from "./components/admin/UsersPage";
import SettingsPage from "./components/admin/SettingsPage";
import SubmitCompanion from "./components/companion/SubmitCompanion";
import CompanionsPage from "./components/admin/CompanionsPage";
import CompanionChat from "./components/companion/CompanionChat";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-black">
        <MainNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<UsersPage />} />
            <Route path="companions" element={<CompanionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/submit" element={<SubmitCompanion />} />
          <Route path="/chat/:companionId" element={<CompanionChat />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
