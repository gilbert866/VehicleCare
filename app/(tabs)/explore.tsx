import AuthGuard from "@/components/AuthGuard";
import ExploreScreen from "../../screens/Explore/index";

export default function ExploreTab() {
  return (
    <AuthGuard>
      <ExploreScreen />
    </AuthGuard>
  );
}