import {useState} from "react";
import {Text, ScrollView, ToastAndroid} from "react-native";

import {useAuth} from "@/context/auth-context";
import CustomButton from "@/components/custom-button";
import FormField from "@/components/form-field";

const ProfileUserAddress = () => {
  const {loading, authState, addUserAddress} = useAuth();

  const [form, setForm] = useState({
    city: authState?.city,
    state: authState?.state,
    country: authState?.country,
    zip: authState?.zip,
    addressline: authState?.addressline,
  });

  const handleSubmit = () => {
    if (
      !form.city ||
      !form.state ||
      !form.country ||
      !form.zip ||
      !form.addressline
    ) {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    addUserAddress!(
      form.city,
      form.state,
      form.country,
      form.zip,
      form.addressline,
      authState?.accesstoken!
    );
  };

  return (
    <ScrollView
      className="mt-5 h-full px-3"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold my-5">
        Profile Updater User Address
      </Text>
      <FormField
        title="City"
        placeholder="Enter your city"
        value={form.city}
        handleChangeText={(text: any) => setForm({...form, city: text})}
        otherStyles="mb-3"
      />
      <FormField
        title="State"
        placeholder="Enter your state"
        value={form.state}
        handleChangeText={(text: any) => setForm({...form, state: text})}
        otherStyles="mb-3"
      />
      <FormField
        title="Country"
        placeholder="Enter your country"
        value={form.country}
        handleChangeText={(text: any) => setForm({...form, country: text})}
        otherStyles="mb-3"
      />
      <FormField
        title="Zip"
        placeholder="Enter your zip"
        value={form.zip}
        handleChangeText={(text: any) => setForm({...form, zip: text})}
        otherStyles="mb-3"
      />
      <FormField
        title="Addressline"
        placeholder="Enter your addressline"
        value={form.addressline}
        handleChangeText={(text: any) => setForm({...form, addressline: text})}
        otherStyles="mb-3"
      />
      <CustomButton
        title="Update Address"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </ScrollView>
  );
};

export default ProfileUserAddress;
