import {useEffect, useState} from "react";
import {View, Text, ToastAndroid} from "react-native";
import axios from "axios";

import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {formatterINR} from "@/lib/utils";

interface DashboardTypes {
  totalUsers: number;
  activeUsers: number;
  totalDepositAmount: number;
  totalWithdrawalAmount: number;
  totalBetAmount: number;
  totalWinAmount: number;
  totalPenaltyAmount: number;
  totalRefundAmount: number;
  totalQuestions: number;
  pendingQuestions: number;
  totalTransactions: number;
  totalCategories: number;
  totalEntries: number;
}

const AdminDashboard = () => {
  const {authState} = useAuth();

  const [dashboard, setDashboard] = useState<DashboardTypes>();

  const getDashboard = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/dashboard`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      setDashboard(response.data);
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

  useEffect(() => {
    getDashboard();
  }, [authState?.accesstoken]);

  return (
    <View className="mb-5 p-3">
      <Text className="text-lg font-bold">Admin Dashboard</Text>
      <Text className="text-base mt-2">
        Total Users: {dashboard?.totalUsers}
      </Text>
      <Text className="text-base mt-2">
        Total Active Users: {dashboard?.activeUsers}
      </Text>
      <Text className="text-base mt-2">
        Total Transactions: {dashboard?.totalTransactions}
      </Text>
      <Text className="text-base mt-2">
        Total Categories: {dashboard?.totalCategories}
      </Text>
      <Text className="text-base mt-2">
        Total Entries: {dashboard?.totalEntries}
      </Text>
      <Text className="text-base mt-2">
        Total Questions: {dashboard?.totalQuestions}
      </Text>
      <Text className="text-base mt-2">
        Pending Questions: {dashboard?.pendingQuestions}
      </Text>
      <Text className="text-base mt-2">
        Total Deposits:{" "}
        {formatterINR.format(dashboard?.totalDepositAmount as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Withdrawals:{" "}
        {formatterINR.format(dashboard?.totalWithdrawalAmount as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Bet: {formatterINR.format(dashboard?.totalBetAmount as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Win: {formatterINR.format(dashboard?.totalWinAmount as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Penalty:{" "}
        {formatterINR.format(dashboard?.totalPenaltyAmount as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Refund: {formatterINR.format(dashboard?.totalRefundAmount as any)}
      </Text>
    </View>
  );
};

export default AdminDashboard;
