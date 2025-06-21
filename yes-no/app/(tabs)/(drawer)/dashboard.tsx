import {ScrollView} from "react-native";

import AdminDashboard from "@/components/admin-dashboard";
import UserDashboard from "@/components/user-dashboard";
import {useAuth} from "@/context/auth-context";

const Dashboard = () => {
  const {authState} = useAuth();

  return (
    <ScrollView>
      <UserDashboard />
      {authState?.role === "admin" && <AdminDashboard />}
    </ScrollView>
  );
};

export default Dashboard;
