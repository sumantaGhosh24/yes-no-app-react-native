import {useEffect, useState} from "react";
import {View, Text, ToastAndroid, ScrollView} from "react-native";
import {router} from "expo-router";
import axios from "axios";
import {Row, Table} from "react-native-table-component";
import {formatDistanceToNowStrict} from "date-fns";
import {FontAwesome} from "@expo/vector-icons";

import CustomButton from "@/components/custom-button";
import IconButton from "@/components/icon-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {formatterINR} from "@/lib/utils";

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
  starting: Date;
  ending: Date;
  result: "pending" | "completed";
  answer?: "yes" | "no";
  createdAt: any;
  updatedAt: any;
}

const ManageQuestion = () => {
  const {authState} = useAuth();

  const [questions, setQuestions] = useState<QuestionTypes[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getQuestions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/questions?page=${page}&limit=10`,
        {
          headers: {Authorization: `Bearer ${authState?.accesstoken}`},
        }
      );

      setQuestions((prev) => [...prev, ...response.data.questions]);
      setHasMore(response.data.count > page * 10);
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
  }, [authState?.accesstoken, page]);

  const loadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "Owner",
      "Category",
      "Question",
      "Min Bet",
      "Max Bet",
      "Starting",
      "Ending",
      "Result",
      "Answer",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
  });

  const handleDelete = async (id: string) => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await axios.delete(`${BASE_URL}/question/${id}`, {
        headers: {Authorization: `Bearer ${authState?.accesstoken}`},
      });

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        getQuestions();
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
    <View className="h-full">
      <ScrollView showsVerticalScrollIndicator={false} className="px-3">
        <CustomButton
          containerStyles="bg-blue-700 my-5"
          title="Create Question"
          handlePress={() => router.push("/question/create")}
        />
        {questions.length === 0 ? (
          <Text className="text-center font-bold text-xl mt-5">
            No questions found.
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              padding: 16,
              paddingTop: 30,
              backgroundColor: "#fff",
              marginTop: 20,
              borderRadius: 7,
            }}
          >
            <Text className="mb-5 text-xl font-bold">All Questions</Text>
            <ScrollView horizontal={true} className="mb-5">
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: "#1D4ED8"}}>
                  <Row
                    data={data.tableHead}
                    widthArr={data.widthArr}
                    style={{height: 40, backgroundColor: "#1D4ED8"}}
                    textStyle={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "white",
                    }}
                  />
                </Table>
                <ScrollView>
                  <Table borderStyle={{borderWidth: 1, borderColor: "#1D4ED8"}}>
                    {questions
                      .map((question) => [
                        question._id,
                        question.owner.username,
                        question.category.name,
                        question.question,
                        formatterINR.format(question.minBet),
                        formatterINR.format(question.maxBet),
                        new Date(question.starting).toLocaleDateString(),
                        new Date(question.ending).toLocaleDateString(),
                        <View className="flex flex-row items-center ml-3">
                          <Text
                            className={`px-2 text-xs leading-5 font-semibold rounded-full inline-flex ${
                              question.result === "completed"
                                ? "text-green-800 bg-green-100"
                                : "text-yellow-800 bg-yellow-100"
                            }`}
                          >
                            {question.result}
                          </Text>
                        </View>,
                        question.answer ?? "N/A",
                        formatDistanceToNowStrict(question.createdAt) + " ago",
                        formatDistanceToNowStrict(question.updatedAt) + " ago",
                        <View className="flex flex-row ml-[45px]">
                          <IconButton
                            icon={
                              <FontAwesome
                                name="pencil"
                                size={24}
                                color="white"
                              />
                            }
                            isLoading={loading}
                            containerStyles="bg-[#1ac50e] mr-3"
                            handlePress={() =>
                              router.push(`/question/update/${question._id}`)
                            }
                          />
                          <IconButton
                            icon={
                              <FontAwesome
                                name="trash"
                                size={24}
                                color="white"
                              />
                            }
                            isLoading={loading}
                            containerStyles="bg-[#e10a11]"
                            handlePress={() => handleDelete(question._id)}
                          />
                        </View>,
                      ])
                      .map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={data.widthArr}
                          style={{height: 100, backgroundColor: "#E7E6E1"}}
                          textStyle={{
                            margin: 6,
                            fontSize: 16,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        />
                      ))}
                  </Table>
                </ScrollView>
                {hasMore && (
                  <CustomButton
                    title="Load More"
                    handlePress={loadMore}
                    containerStyles="bg-blue-700 my-5 w-[250px]"
                  />
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ManageQuestion;
