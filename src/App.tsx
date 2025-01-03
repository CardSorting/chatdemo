import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import MainNav from "./components/layout/MainNav";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import UserProfile from "./components/user/UserProfile";
import ExplorePage from "./components/explore/ExplorePage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./components/admin/AdminLoginPage";
import UsersPage from "./components/admin/UsersPage";
import SettingsPage from "./components/admin/SettingsPage";
import SubmitCompanion from "./components/companion/SubmitCompanion";
import { AuthProvider } from "./components/providers/AuthProvider";
import { PayPalProvider } from "./components/providers/PayPalProvider";
import BookmarksPage from "./components/companion/BookmarksPage";
import CompanionsPage from "./components/companion/companions-page/CompanionsPage";
import TippingPage from "./components/companion/TippingPage";
import SubscriptionPage from "./components/subscription/SubscriptionPage";

function App() {
  return (
    <AuthProvider>
      <PayPalProvider>
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/user/profile/:userId" element={<UserProfile />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/companions/:companionId" element={<CompanionsPage />} />
              <Route path="/companions/:companionId/tip" element={<TippingPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
            </Routes>
          </div>
        </Suspense>
      </PayPalProvider>
    </AuthProvider>
  );
}

export default App;
