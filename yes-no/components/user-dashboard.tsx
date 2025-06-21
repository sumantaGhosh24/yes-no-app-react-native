import {useEffect, useState} from "react";
import {View, Text, ToastAndroid} from "react-native";
import axios from "axios";

import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {formatterINR} from "@/lib/utils";

interface DashboardTypes {
  totalDeposits: number;
  totalWithdrawals: number;
  totalBet: number;
  totalWin: number;
  totalPenalty: number;
  totalRefund: number;
}

const UserDashboard = () => {
  const {authState} = useAuth();

  const [dashboard, setDashboard] = useState<DashboardTypes>();

  const getDashboard = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard`, {
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
      <Text className="text-lg font-bold">User Dashboard</Text>
      <Text className="text-base mt-2">
        Total Deposits: {formatterINR.format(dashboard?.totalDeposits as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Withdrawals:{" "}
        {formatterINR.format(dashboard?.totalWithdrawals as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Bet: {formatterINR.format(dashboard?.totalBet as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Win: {formatterINR.format(dashboard?.totalWin as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Penalty: {formatterINR.format(dashboard?.totalPenalty as any)}
      </Text>
      <Text className="text-base mt-2">
        Total Refund: {formatterINR.format(dashboard?.totalRefund as any)}
      </Text>
    </View>
  );
};

export default UserDashboard;
