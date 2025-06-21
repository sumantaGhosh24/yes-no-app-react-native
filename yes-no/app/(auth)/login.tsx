import {useState} from "react";
import {View, Text, ToastAndroid, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";

import {useAuth} from "@/context/auth-context";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const {onLogin, loading} = useAuth();

  const handleSubmit = () => {
    if (form.email === "" || form.password === "") {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    onLogin!(form.email, form.password);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full flex h-screen px-4">
          <Text className="text-2xl font-bold my-5">User Login</Text>
          <FormField
            title="Email address"
            placeholder="Enter your email address"
            value={form.email}
            handleChangeText={(text: any) => setForm({...form, email: text})}
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
          <CustomButton
            title="Login"
            handlePress={handleSubmit}
            containerStyles="bg-blue-700 disabled:bg-blue-300"
            isLoading={loading}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg">Don&apos;t have an account?</Text>
            <Link
              href="/register"
              className="text-lg font-semibold text-blue-700"
            >
              Register
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
