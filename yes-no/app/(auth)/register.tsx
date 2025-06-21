import {useState} from "react";
import {View, Text, ToastAndroid, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";

import {useAuth} from "@/context/auth-context";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    mobileNumber: "",
    password: "",
    cf_password: "",
  });

  const {onRegister, loading} = useAuth();

  const handleSubmit = () => {
    if (
      form.email === "" ||
      form.mobileNumber === "" ||
      form.password === "" ||
      form.cf_password === ""
    ) {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    if (form.password !== form.cf_password) {
      return ToastAndroid.showWithGravityAndOffset(
        "Password and confirm password not match!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    onRegister!(form.email, form.mobileNumber, form.password, form.cf_password);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex h-screen px-4">
          <Text className="text-2xl font-bold my-5">User Registration</Text>
          <FormField
            title="Email address"
            placeholder="Enter your email address"
            value={form.email}
            handleChangeText={(text: any) => setForm({...form, email: text})}
            otherStyles="mb-4"
          />
          <FormField
            title="Mobile number"
            placeholder="Enter your mobileNumber"
            value={form.mobileNumber}
            handleChangeText={(text: any) =>
              setForm({...form, mobileNumber: text})
            }
            otherStyles="mb-4"
          />
          <FormField
            title="Password"
            placeholder="Enter your password"
            value={form.password}
            handleChangeText={(text: any) => setForm({...form, password: text})}
            type="password"
            otherStyles="mb-4"
          />
          <FormField
            title="Confirm Password"
            placeholder="Enter your password again"
            value={form.cf_password}
            handleChangeText={(text: any) =>
              setForm({...form, cf_password: text})
            }
            type="password"
            otherStyles="mb-4"
          />
          <CustomButton
            title="Register"
            handlePress={handleSubmit}
            containerStyles="bg-blue-700 disabled:bg-blue-300"
            isLoading={loading}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-black">Already have an account?</Text>
            <Link href="/login" className="text-lg font-semibold text-blue-700">
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
