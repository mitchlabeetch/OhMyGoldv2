import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppRoutes } from "@/routes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <a href="#main-content" className="skip-to-content">
          Aller au contenu principal
        </a>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
