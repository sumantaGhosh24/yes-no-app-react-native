import {useState} from "react";
import {Text, ScrollView, ToastAndroid, View, StyleSheet} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import {FontAwesome} from "@expo/vector-icons";

import {useAuth} from "@/context/auth-context";
import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";

const genderData = [{title: "male"}, {title: "female"}];

const ProfileUserData = () => {
  const {loading, authState, addUserData} = useAuth();

  const [form, setForm] = useState({
    firstName: authState?.firstName,
    lastName: authState?.lastName,
    username: authState?.username,
    gender: authState?.gender,
  });

  const [date, setDate] = useState<Date>(
    authState?.dob ? new Date(authState?.dob) : new Date()
  );
  const [show, setShow] = useState(false);

  const onChange = (selectedDate?: any) => {
    setShow(false);
    if (selectedDate) {
      setDate(new Date(selectedDate?.nativeEvent?.timestamp));
    }
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.username || !form.gender) {
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    addUserData!(
      form.firstName,
      form.lastName,
      form.username,
      date as any,
      form.gender,
      authState?.accesstoken!
    );
  };

  return (
    <ScrollView
      className="mt-5 h-full px-3"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold my-5">Profile Update User Data</Text>
      <FormField
        title="First Name"
        placeholder="Enter your first name"
        value={form.firstName}
        handleChangeText={(text: any) => setForm({...form, firstName: text})}
        otherStyles="mb-3"
      />
      <FormField
        title="Last Name"
        placeholder="Enter your last name"
        value={form.lastName}
        handleChangeText={(text: any) => setForm({...form, lastName: text})}
        otherStyles="mb-3"
      />
      <FormField
        title="Username"
        placeholder="Enter your username"
        value={form.username}
        handleChangeText={(text: any) => setForm({...form, username: text})}
        otherStyles="mb-3"
      />
      <Text className="mb-1.5 font-bold">{new Date(date).toDateString()}</Text>
      <CustomButton
        handlePress={() => setShow(true)}
        title="DOB"
        containerStyles="bg-blue-700 mb-5"
      />
      {show && (
        <RNDateTimePicker
          value={date}
          mode="date"
          onChange={onChange as any}
          minimumDate={new Date(1990, 0, 1)}
          maximumDate={new Date(2025, 0, 1)}
        />
      )}
      <SelectDropdown
        data={genderData}
        onSelect={(selectedItem) => {
          setForm({...form, gender: selectedItem.title});
        }}
        defaultValue={{title: form.gender}}
        renderButton={(selectedItem, isOpened) => {
          console.log(selectedItem);
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.title) || "Select your gender"}
              </Text>
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && {backgroundColor: "#D2D9DF"}),
              }}
            >
              <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <CustomButton
        title="Update User"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 24,
    marginRight: 8,
  },
});

export default ProfileUserData;
