import {useState} from "react";
import {View, Text, ToastAndroid} from "react-native";
import axios from "axios";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";

import FormField from "./form-field";
import CustomButton from "./custom-button";

const Withdraw = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {authState} = useAuth();

  const handleWithdraw = async () => {
    if (amount === 0) {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/withdraw`,
        {amount},
        {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        setAmount(0);
      }
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-3">
      <Text className="text-2xl font-bold mb-5">Withdraw Money</Text>
      <FormField
        title="Amount"
        placeholder="Enter withdraw amount"
        value={amount}
        handleChangeText={(text: any) => setAmount(text)}
        otherStyles="mb-3"
      />
      <CustomButton
        title="Withdraw"
        handlePress={handleWithdraw}
        containerStyles="bg-blue-700"
        isLoading={loading}
      />
    </View>
  );
};

export default Withdraw;
