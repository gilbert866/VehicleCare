import AuthGuard from "@/components/AuthGuard";
import SettingsScreen from "../../screens/Settings/index";

export default function SettingsTab() {
  return (
    <AuthGuard>
      <SettingsScreen />
    </AuthGuard>
  );
}