import {useEffect, useState} from "react";
import {View, Text, ToastAndroid, StyleSheet, ScrollView} from "react-native";
import axios from "axios";
import {Row, Table} from "react-native-table-component";
import SelectDropdown from "react-native-select-dropdown";
import {formatDistanceToNowStrict} from "date-fns";
import {FontAwesome} from "@expo/vector-icons";

import CustomButton from "@/components/custom-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {formatterINR} from "@/lib/utils";
import FormField from "@/components/form-field";

const transactionStatus = [
  {title: "deposit"},
  {title: "withdraw"},
  {title: "bet"},
  {title: "win"},
  {title: "penalty"},
  {title: "refund"},
];
const sort = [
  {title: "Newest", value: "&sort=-createdAt"},
  {title: "Oldest", value: "&sort=createdAt"},
  {title: "Amount: Hight-Low", value: "&sort=-amount"},
  {title: "Amount: Low-Hight", value: "&sort=amount"},
];

interface TransactionTypes {
  _id: string;
  user: string;
  amount: number;
  message: string;
  status: "deposit" | "withdraw" | "bet" | "win" | "penalty" | "refund";
  paymentResult: {
    id: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  createdAt: any;
  updatedAt: any;
}

const amountStyle: any = {
  deposit: "text-green-600",
  withdraw: "text-red-600",
  bet: "text-yellow-600",
  win: "text-green-600",
  penalty: "text-red-600",
  refund: "text-yellow-600",
};
const statusStyle: any = {
  deposit: "bg-green-100 text-green-800",
  withdraw: "bg-red-100 text-red-800",
  bet: "bg-yellow-100 text-yellow-800",
  win: "bg-green-100 text-green-800",
  penalty: "bg-red-100 text-red-800",
  refund: "bg-yellow-100 text-yellow-800",
};

const ManageTransaction = () => {
  const {authState} = useAuth();

  const [transactions, setTransactions] = useState<TransactionTypes[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState("");
  const [sortBy, setSort] = useState("");
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getTransactions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/all-transactions?page=${page}&limit=10${status}${sortBy}`,
        {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
      );

      setTransactions((prev) => [...prev, ...response.data.transactions]);
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
    getTransactions();
  }, [page, status]);

  const loadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "User",
      "Amount",
      "Message",
      "Status",
      "Payment Result",
      "Created At",
      "Updated At",
    ],
    widthArr: [200, 200, 200, 200, 200, 200, 200, 200],
  });

  const handlePenalty = async () => {
    if (amount === 0 || userId === "") {
      return ToastAndroid.showWithGravityAndOffset(
        "Please fill all the fields",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/penalty/${userId}`,
        {amount},
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
        getTransactions();
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
        <Text className="my-5 text-xl font-bold">All Transactions</Text>
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
          data={transactionStatus}
          onSelect={(selectedItem) => {
            setStatus(`&status=${selectedItem.title}`);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || "Select a category"}
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
        {transactions.length === 0 ? (
          <Text className="text-center font-bold text-xl my-5">
            No transactions found.
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
                    {transactions
                      .map((transaction) => [
                        transaction._id,
                        transaction.user,
                        <View className="flex flex-row items-center ml-3">
                          <Text
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              amountStyle[transaction.status]
                            }`}
                          >
                            {formatterINR.format(transaction.amount)}
                          </Text>
                        </View>,
                        transaction.message,
                        <View className="flex flex-row items-center ml-3">
                          <Text
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusStyle[transaction.status]
                            }`}
                          >
                            {transaction.status}
                          </Text>
                        </View>,
                        transaction.paymentResult.id ?? "N/A",
                        formatDistanceToNowStrict(transaction.createdAt) +
                          " ago",
                        formatDistanceToNowStrict(transaction.updatedAt) +
                          " ago",
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
        <Text className="my-5 text-xl font-bold">Penalty User</Text>
        <FormField
          title="Penalty User"
          placeholder="Penalty user id"
          value={userId}
          handleChangeText={(text: any) => setUserId(text)}
          otherStyles="mb-3"
        />
        <FormField
          title="Penalty Amount"
          placeholder="Penalty amount"
          value={amount}
          handleChangeText={(text: any) => setAmount(Number(text))}
          otherStyles="mb-3"
        />
        <CustomButton
          handlePress={handlePenalty}
          title="Penalty"
          containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
          isLoading={loading}
        />
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

export default ManageTransaction;
