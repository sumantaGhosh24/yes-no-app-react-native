import {useEffect, useState} from "react";
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import {router} from "expo-router";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";
import {FontAwesome} from "@expo/vector-icons";

import CustomButton from "@/components/custom-button";
import IconButton from "@/components/icon-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {formatterINR} from "@/lib/utils";

const sort = [
  {title: "Newest", value: "&sort=-createdAt"},
  {title: "Oldest", value: "&sort=createdAt"},
  {title: "Amount: Hight-Low", value: "&sort=-amount"},
  {title: "Amount: Low-Hight", value: "&sort=amount"},
];

interface CategoryTypes {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

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
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const {authState} = useAuth();

  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [questions, setQuestions] = useState<QuestionTypes[]>([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [sortBy, setSort] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const getCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category`);

      setCategories(response.data.categories);
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

  const getQuestions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/questions?page=${page}&limit=10${category}${sortBy}`,
        {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
      );

      // setQuestions((prev) => [...prev, ...response.data.questions]);
      setQuestions(response.data.questions);
      setHasMore(response.data.hasMore);
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
    getQuestions();
  }, [page, category]);

  const loadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <View className="h-full">
      <ScrollView className="px-3">
        <Text className="my-5 text-xl font-bold">All Questions</Text>
        <SelectDropdown
          data={sort}
          onSelect={(selectedItem) => {
            setSort(selectedItem.value);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || "Select a order"}
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
        <SelectDropdown
          data={categories}
          onSelect={(selectedItem) => {
            setCategory(`&category=${selectedItem._id}`);
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
        {questions.length === 0 ? (
          <Text className="text-center font-bold text-xl my-5">
            No questions found.
          </Text>
        ) : (
          <View>
            {questions.map((question) => (
              <View
                key={question._id}
                className="border-2 border-solid border-black p-3 rounded mb-3"
              >
                <Text className="text-xl font-bold capitalize">
                  {question.question}
                </Text>
                <Text className="text-base mt-1.5">
                  Minimum Bet: {formatterINR.format(question.minBet)}
                </Text>
                <Text className="text-base mt-1.5">
                  Maximum Bet: {formatterINR.format(question.maxBet)}
                </Text>
                <Text className="text-base mt-1.5">
                  Starting: {new Date(question.starting).toLocaleDateString()}
                </Text>
                <Text className="text-base mt-1.5">
                  Ending: {new Date(question.ending).toLocaleDateString()}
                </Text>
                <Text className="text-base mt-1.5">
                  Category: {question.category.name}
                </Text>
                <Text className="text-base mt-1.5">
                  Owner: {question.owner.email}
                </Text>
                <IconButton
                  icon={<FontAwesome name="eye" size={24} color="white" />}
                  containerStyles="bg-[#1ac50e] mr-3 mr-auto"
                  handlePress={() =>
                    router.push(`/question/details/${question._id}`)
                  }
                />
              </View>
            ))}
            {hasMore && (
              <CustomButton
                title="Load More"
                handlePress={loadMore}
                containerStyles="bg-blue-700 my-5 w-[250px]"
              />
            )}
          </View>
        )}
      </ScrollView>
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

export default Home;
