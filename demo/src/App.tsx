import { useState } from "react";
import HomePage from "./components/HomePage";
import RoleSelect from "./components/RoleSelect";
import DeviceMockup from "./components/DeviceMockup";
import AdminDemo from "./components/demos/AdminDemo";
import ManagerDemo from "./components/demos/ManagerDemo";
import ReceptionnisteDemo from "./components/demos/ReceptionnisteDemo";
import CoachDemo from "./components/demos/CoachDemo";
import MembreDemo from "./components/demos/MembreDemo";
import VisiteurDemo from "./components/demos/VisiteurDemo";

export type Platform = "web" | "mobile";
export type Role =
  | "admin"
  | "manager"
  | "receptionniste"
  | "coach"
  | "membre"
  | "visiteur";
export type AppState = "home" | "roleSelect" | "demo";

const DEMO_COMPONENTS: Record<Role, React.ComponentType> = {
  admin: AdminDemo,
  manager: ManagerDemo,
  receptionniste: ReceptionnisteDemo,
  coach: CoachDemo,
  membre: MembreDemo,
  visiteur: VisiteurDemo,
};

export default function App() {
  const [state, setState] = useState<AppState>("home");
  const [platform, setPlatform] = useState<Platform>("web");
  const [role, setRole] = useState<Role>("admin");

  const handlePlatformSelect = (p: Platform) => {
    setPlatform(p);
    setState("roleSelect");
  };

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setState("demo");
  };

  const handleBack = () => {
    if (state === "demo") setState("roleSelect");
    else if (state === "roleSelect") setState("home");
    else setState("home");
  };

  const handleHome = () => setState("home");

  const DemoComponent = DEMO_COMPONENTS[role];

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans">
      {state === "home" && (
        <div className="page-enter">
          <HomePage onSelect={handlePlatformSelect} />
        </div>
      )}
      {state === "roleSelect" && (
        <div className="page-enter">
          <RoleSelect
            platform={platform}
            onSelect={handleRoleSelect}
            onBack={handleBack}
          />
        </div>
      )}
      {state === "demo" && (
        <div className="page-enter">
          <DeviceMockup
            platform={platform}
            role={role}
            onBack={handleBack}
            onHome={handleHome}
          >
            <DemoComponent />
          </DeviceMockup>
        </div>
      )}
    </div>
  );
}
