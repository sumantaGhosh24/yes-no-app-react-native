import {View, Text} from "react-native";
import {FontAwesome} from "@expo/vector-icons";

import {useAuth} from "@/context/auth-context";
import {formatterINR} from "@/lib/utils";

const WalletHeader = () => {
  const {authState} = useAuth();

  return (
    <View className="container mx-auto flex flex-row justify-between items-center rounded shadow-lg p-8 my-5">
      <View className="flex flex-row items-center gap-3">
        <FontAwesome name="money" size={24} />
        <Text className="text-2xl font-bold">My Wallet</Text>
      </View>
      <Text className="text-2xl font-bold">
        {formatterINR.format(authState?.amount ?? 0)}
      </Text>
    </View>
  );
};

export default WalletHeader;
