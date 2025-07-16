import AuthGuard from "@/components/AuthGuard";
import BatteryMonitoringScreen from "../../screens/BatteryMonitoring/index";

export default function MonitoringTab() {
  return (
    <AuthGuard>
      <BatteryMonitoringScreen />
    </AuthGuard>
  );
}