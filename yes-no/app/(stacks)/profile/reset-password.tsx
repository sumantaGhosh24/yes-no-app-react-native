import {useState} from "react";
import {Text, ScrollView, ToastAndroid} from "react-native";

import {useAuth} from "@/context/auth-context";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";

const ProfileResetPassword = () => {
  const [form, setForm] = useState({
    previousPassword: "",
    newPassword: "",
    cf_newPassword: "",
  });

  const {loading, resetPassword, authState} = useAuth();

  const handleSubmit = () => {
    if (
      form.previousPassword === "" ||
      form.newPassword === "" ||
      form.cf_newPassword === ""
    ) {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    if (form.newPassword !== form.cf_newPassword) {
      return ToastAndroid.showWithGravityAndOffset(
        "Password and confirm password not match!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    resetPassword!(
      form.previousPassword,
      form.newPassword,
      form.cf_newPassword,
      authState?.accesstoken!
    );
  };

  return (
    <ScrollView
      className="mt-5 h-full px-3"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold my-5">Profile Reset Password</Text>
      <FormField
        title="Previous Password"
        placeholder="Enter your previous password"
        value={form.previousPassword}
        handleChangeText={(text: any) =>
          setForm({...form, previousPassword: text})
        }
        otherStyles="mb-3"
        type="password"
      />
      <FormField
        title="New Password"
        placeholder="Enter your new password"
        value={form.newPassword}
        handleChangeText={(text: any) => setForm({...form, newPassword: text})}
        otherStyles="mb-3"
        type="password"
      />
      <FormField
        title="Confirm New Password"
        placeholder="Enter your confirm new password"
        value={form.cf_newPassword}
        handleChangeText={(text: any) =>
          setForm({...form, cf_newPassword: text})
        }
        otherStyles="mb-3"
        type="password"
      />
      <CustomButton
        title="Reset Password"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </ScrollView>
  );
};

export default ProfileResetPassword;
