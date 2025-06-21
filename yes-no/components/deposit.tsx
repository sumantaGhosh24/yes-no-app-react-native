import {useState} from "react";
import {View, Text, ToastAndroid} from "react-native";
import axios from "axios";
import RazorpayCheckout from "react-native-razorpay";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";
import {RAZORPAY_KEY} from "@/config";

import FormField from "./form-field";
import CustomButton from "./custom-button";

const Deposit = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {authState} = useAuth();

  const handleDeposit = async () => {
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
        `${BASE_URL}/deposit`,
        {amount},
        {
          headers: {
            Authorization: `Bearer ${authState?.accesstoken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success === false) {
        return ToastAndroid.showWithGravityAndOffset(
          "Something went wrong, try again later!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }

      var options = {
        description: "Deposit Money",
        image: "https://i.imgur.com/3g7nmJC.png",
        currency: response.data.order.currency,
        key: RAZORPAY_KEY,
        amount: response.data.order.amount,
        order_id: response.data.order.id,
        theme: {color: "#1D4ED8"},
        name: authState?.username!,
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          const res = await axios.post(
            `${BASE_URL}/verify`,
            {
              orderCreationId: response.data.order.id,
              razorpayPaymentId: data.razorpay_payment_id,
              razorpayOrderId: data.razorpay_order_id,
              razorpaySignature: data.razorpay_signature,
              amount: response.data.order.amount / 100,
            },
            {
              headers: {
                Authorization: `Bearer ${authState?.accesstoken}`,
                "Content-Type": "application/json",
              },
            }
          );

          setAmount(0);

          if (res.data.success === true)
            ToastAndroid.showWithGravityAndOffset(
              "Payment Success!",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
        })
        .catch((error) => {
          ToastAndroid.showWithGravityAndOffset(
            `${error.code} | ${error.description}`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        });
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
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
      <Text className="text-2xl font-bold mb-5">Deposit Money</Text>
      <FormField
        title="Amount"
        placeholder="Enter deposit amount"
        value={amount}
        handleChangeText={(text: any) => setAmount(text)}
        otherStyles="mb-3"
      />
      <CustomButton
        title="Deposit"
        handlePress={handleDeposit}
        containerStyles="bg-blue-700"
        isLoading={loading}
      />
    </View>
  );
};

export default Deposit;
