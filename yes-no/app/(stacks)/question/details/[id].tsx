import {useState, useEffect} from "react";
import {
  View,
  Text,
  ToastAndroid,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router, useLocalSearchParams} from "expo-router";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";
import {FontAwesome} from "@expo/vector-icons";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";
import CustomButton from "@/components/custom-button";
import FormField from "@/components/form-field";
import {formatterINR} from "@/lib/utils";

const answerData = [{title: "Yes"}, {title: "No"}];

interface QuestionTypes {
  _id: string;
  owner: {
    _id: string;
    username: string;
    email: string;
    mobileNumber: string;
    image: {
      url: string;
      public_id: string;
    };
  };
  category: {
    name: string;
    image: {
      url: string;
      public_id: string;
    };
  };
  question: string;
  minBet: number;
  maxBet: number;
  starting: any;
  ending: any;
  result: "pending" | "completed";
  answer: "yes" | "no";
  createdAt: any;
  updatedAt: any;
}

const QuestionDetails = () => {
  const {id} = useLocalSearchParams();
  const {authState} = useAuth();

  const [question, setQuestion] = useState<QuestionTypes>();
  const [bet, setBet] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const getQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/question/${id}`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      if (response.data.success === true) {
        setQuestion(response.data.question);
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

  useEffect(() => {
    getQuestion();
  }, [authState?.accesstoken, id]);

  const handleAddEntry = async () => {
    if (loading || !id || !question?._id || answer == "") return null;

    if (question.minBet > bet || question.maxBet < bet) {
      return ToastAndroid.showWithGravityAndOffset(
        "Please add proper bet amount!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/question/${id}`,
        {id, bet, answer},
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
        setBet(0);
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
    <SafeAreaView className="h-screen">
      <ScrollView>
        <View className="w-full space-y-4 px-4">
          <View className="flex flex-row justify-between items-center my-5">
            <Text className="text-2xl font-bold mr-5">Question Details</Text>
            {authState?.role === "admin" ? (
              <CustomButton
                title="Questions"
                containerStyles="bg-blue-700"
                handlePress={() => router.push("/manage-question")}
              />
            ) : (
              <CustomButton
                title="Home"
                containerStyles="bg-blue-700"
                handlePress={() => router.push("/home")}
              />
            )}
          </View>
          {!loading && (
            <>
              <Text className="text-xl font-bold capitalize">
                {question?.question}
              </Text>
              <View className="flex flex-row items-center gap-2 mt-2">
                <Text className="text-sm font-bold">Question Id:</Text>
                <Text className="text-sm">{question?._id}</Text>
              </View>
              <View className="flex flex-row items-center gap-2 mt-2">
                <Text className="text-sm font-bold">Minimum Bet:</Text>
                <Text className="text-sm">
                  {formatterINR.format(question?.minBet as any)}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2 mt-2">
                <Text className="text-sm font-bold">Maximum Bet:</Text>
                <Text className="text-sm">
                  {formatterINR.format(question?.maxBet as any)}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2 mt-2">
                <Text className="text-sm font-bold">Starting:</Text>
                <Text className="text-sm">
                  {new Date(question?.starting).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2 mt-2">
                <Text className="text-sm font-bold">Ending:</Text>
                <Text className="text-sm">
                  {new Date(question?.ending).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2 mt-2">
                <Text className="text-sm font-bold">Result:</Text>
                <Text className="text-sm">{question?.result ?? "N/A"}</Text>
              </View>
              <View className="flex flex-row items-center gap-2 mt-2">
                <Text className="text-sm font-bold">Answer:</Text>
                <Text className="text-sm">{question?.answer ?? "N/A"}</Text>
              </View>
              <View className="mt-2">
                <Text className="text-sm font-bold mb-3">Owner:</Text>
                <View className="flex flex-row items-center gap-3">
                  <Image
                    source={{uri: question?.owner?.image.url}}
                    resizeMode="cover"
                    className="h-16 w-16 rounded mr-3"
                  />
                  <View>
                    <Text className="font-bold">{question?.owner?.email}</Text>
                    <Text className="font-bold">
                      {question?.owner?.username}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mt-2">
                <Text className="text-sm font-bold mb-3">Category:</Text>
                <View className="flex flex-row items-center gap-3">
                  <Image
                    source={{uri: question?.category?.image.url}}
                    resizeMode="cover"
                    className="h-16 w-16 rounded mr-3"
                  />
                  <Text className="text-capitalize font-bold">
                    {question?.category?.name}
                  </Text>
                </View>
              </View>
            </>
          )}
          <View className="mt-5">
            <Text className="text-2xl font-bold my-5">Add Entry</Text>
            <FormField
              title="Bet Amount"
              placeholder="Enter bet amount"
              value={bet}
              handleChangeText={(text: any) => setBet(text)}
              otherStyles="mb-3"
            />
            <SelectDropdown
              data={answerData}
              onSelect={(selectedItem) => {
                setAnswer(selectedItem.title.toLowerCase());
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.title) ||
                        "Select your answer"}
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
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item.title}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
            <CustomButton
              title="Add Entry"
              handlePress={handleAddEntry}
              containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
              isLoading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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

export default QuestionDetails;
