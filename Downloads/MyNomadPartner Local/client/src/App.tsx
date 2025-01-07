import { Switch, Route } from "wouter";
import { Sidebar } from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import PlannerPage from "./pages/PlannerPage";
import TravelToolsPage from "./pages/TravelToolsPage";
import SupportPage from "./pages/SupportPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/planner" component={PlannerPage} />
          <Route path="/travel" component={TravelToolsPage} />
          <Route path="/support" component={SupportPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route>404 - Not Found</Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;