import {useEffect, useState} from "react";
import {View, Text, ToastAndroid, StyleSheet, Image} from "react-native";
import {router} from "expo-router";
import axios from "axios";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";

import FormField from "@/components/form-field";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {FontAwesome} from "@expo/vector-icons";
import CustomButton from "@/components/custom-button";

interface CategoryTypes {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

const CreateQuestion = () => {
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<CategoryTypes[]>([]);
  const [form, setForm] = useState({
    question: "",
    minBet: "",
    maxBet: "",
    category: "",
  });

  const [starting, setStarting] = useState<Date>(new Date());
  const [ending, setEnding] = useState<Date>(new Date());

  const [startingShow, setStartingShow] = useState(false);
  const [endingShow, setEndingShow] = useState(false);

  const onStartingChange = (selectedDate?: any) => {
    setStartingShow(false);
    if (selectedDate) {
      setStarting(new Date(selectedDate?.nativeEvent?.timestamp));
    }
  };
  const onEndingChange = (selectedDate?: any) => {
    setEndingShow(false);
    if (selectedDate) {
      setEnding(new Date(selectedDate?.nativeEvent?.timestamp));
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category`);

      setCategory(response.data.categories);
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
    getCategories();
  }, [authState?.accesstoken]);

  const handleSubmit = async () => {
    if (
      form.question === "" ||
      form.minBet === "" ||
      form.maxBet === "" ||
      !starting ||
      !ending ||
      form.category === ""
    ) {
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
        `${BASE_URL}/question`,
        {...form, starting, ending},
        {
          headers: {Authorization: `Bearer ${authState?.accesstoken}`},
        }
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        router.push("/manage-question");
      }
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
    <View className="h-full p-3">
      <Text className="text-2xl font-bold my-5">Create Question</Text>
      <FormField
        title="Question Title"
        placeholder="Enter question title"
        value={form.question}
        handleChangeText={(text: any) => setForm({...form, question: text})}
        otherStyles="mb-3"
      />
      <FormField
        title="Question Minimum Bet"
        placeholder="Enter question minimum bet"
        value={form.minBet}
        handleChangeText={(text: any) => setForm({...form, minBet: text})}
        otherStyles="mb-3"
      />
      <FormField
        title="Question Maximum Bet"
        placeholder="Enter question maximum bet"
        value={form.maxBet}
        handleChangeText={(text: any) => setForm({...form, maxBet: text})}
        otherStyles="mb-3"
      />
      <SelectDropdown
        data={category}
        onSelect={(selectedItem) => {
          setForm({...form, category: selectedItem._id});
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem._id) || "Select a category"}
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
              <Image
                source={{uri: item.image.url}}
                resizeMode="cover"
                className="h-10 w-10 rounded-full mr-2"
              />
              <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <Text className="mb-1.5 font-bold">
        {new Date(starting).toDateString()}
      </Text>
      <CustomButton
        handlePress={() => setStartingShow(true)}
        title="Starting"
        containerStyles="bg-blue-700 mb-5"
      />
      {startingShow && (
        <RNDateTimePicker
          value={starting}
          mode="date"
          onChange={onStartingChange as any}
          minimumDate={new Date()}
          maximumDate={new Date(2026, 0, 1)}
        />
      )}
      <Text className="mb-1.5 font-bold">
        {new Date(ending).toDateString()}
      </Text>
      <CustomButton
        handlePress={() => setEndingShow(true)}
        title="Ending"
        containerStyles="bg-blue-700 mb-5"
      />
      {endingShow && (
        <RNDateTimePicker
          value={ending}
          mode="date"
          onChange={onEndingChange as any}
          minimumDate={new Date()}
          maximumDate={new Date(2026, 0, 1)}
        />
      )}
      <CustomButton
        title="Create Question"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </View>
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

export default CreateQuestion;
