import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./components/admin/AdminLoginPage";
import UsersPage from "./components/admin/UsersPage";
import SettingsPage from "./components/admin/SettingsPage";
import SubmitCompanion from "./components/companion/SubmitCompanion";
import CompanionsPage from "./components/admin/CompanionsPage";
import CompanionChat from "./components/companion/CompanionChat";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<UsersPage />} />
            <Route path="companions" element={<CompanionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/submit" element={<SubmitCompanion />} />
          <Route path="/chat/:companionId" element={<CompanionChat />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
