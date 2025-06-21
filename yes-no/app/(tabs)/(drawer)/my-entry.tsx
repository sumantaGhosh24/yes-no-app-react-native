import {useEffect, useState} from "react";
import {View, Text, ToastAndroid, StyleSheet, ScrollView} from "react-native";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";
import {Row, Table} from "react-native-table-component";
import {formatDistanceToNowStrict} from "date-fns";
import {FontAwesome} from "@expo/vector-icons";

import CustomButton from "@/components/custom-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {formatterINR} from "@/lib/utils";

const sort = [
  {title: "Newest", value: "&sort=-createdAt"},
  {title: "Oldest", value: "&sort=createdAt"},
  {title: "Bet: Hight-Low", value: "&sort=-bet"},
  {title: "Bet: Low-Hight", value: "&sort=bet"},
  {title: "Win: Hight-Low", value: "&sort=-win"},
  {title: "Win: Low-Hight", value: "&sort=win"},
];

interface EntryTypes {
  _id: string;
  question: {
    question: string;
    category: {
      name: string;
      image: {
        url: string;
        public_id: string;
      };
    };
  };
  bet: number;
  win: number;
  result: "success" | "failed" | "pending";
  answer?: string;
  createdAt: string;
  updatedAt: string;
}

const ManageEntry = () => {
  const {authState} = useAuth();

  const [entries, setEntries] = useState<EntryTypes[]>([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSort] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const getEntries = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/entrys?page=${page}&limit=10${sortBy}`,
        {
          headers: {Authorization: `Bearer ${authState?.accesstoken}`},
        }
      );

      setEntries((prev) => [...prev, ...response.data.entries]);
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
    getEntries();
  }, [page, sortBy]);

  const loadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "Question",
      "Answer",
      "Bet",
      "Win",
      "Result",
      "Created At",
      "Updated At",
    ],
    widthArr: [200, 200, 200, 200, 200, 200, 200, 200],
  });

  return (
    <View className="h-full">
      <ScrollView showsVerticalScrollIndicator={false} className="px-3">
        <Text className="mb-5 text-xl font-bold">My Entries</Text>
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
        {entries.length === 0 ? (
          <Text className="text-center font-bold text-xl my-5">
            No entries found.
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              padding: 16,
              paddingTop: 30,
              backgroundColor: "#fff",
              marginTop: 20,
              marginBottom: 20,
              borderRadius: 7,
            }}
          >
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
                    {entries
                      .map((entry) => [
                        entry._id,
                        entry.question.question,
                        entry.answer ?? "N/A",
                        formatterINR.format(entry.bet),
                        formatterINR.format(entry.win ?? 0),
                        <View className="flex flex-row items-center ml-3">
                          <Text
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              entry.result === "success"
                                ? "bg-green-100 text-green-800"
                                : entry.result === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {entry.result}
                          </Text>
                        </View>,
                        formatDistanceToNowStrict(entry.createdAt) + " ago",
                        formatDistanceToNowStrict(entry.updatedAt) + " ago",
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

export default ManageEntry;
