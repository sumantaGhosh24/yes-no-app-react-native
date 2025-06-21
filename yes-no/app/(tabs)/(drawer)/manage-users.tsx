import {useEffect, useState} from "react";
import {View, Text, ToastAndroid, ScrollView, Image} from "react-native";
import axios from "axios";
import {Table, Row} from "react-native-table-component";
import {formatDistanceToNowStrict} from "date-fns";

import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import CustomButton from "@/components/custom-button";

interface UserTypes {
  _id: string;
  email: string;
  mobileNumber: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  image: {url: string | null; public_id: string | null};
  dob: any | null;
  gender: "male" | "female" | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  addressline: string | null;
  role: "user" | "admin";
  createdAt: any;
  updatedAt: any;
}

const ManageUsers = () => {
  const {authState} = useAuth();

  const [users, setUsers] = useState<UserTypes[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users?page=${page}&limit=10`,
        {
          headers: {Authorization: `Bearer ${authState?.accesstoken}`},
        }
      );

      setUsers((prev) => [...prev, ...response.data.users]);
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
    getUsers();
  }, [authState?.accesstoken, page]);

  const loadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "Email",
      "Mobile Number",
      "Name",
      "Username",
      "Image",
      "DOB",
      "Gender",
      "City",
      "State",
      "Country",
      "Zip",
      "Addressline",
      "Role",
      "Created At",
      "Updated At",
    ],
    widthArr: [
      200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
      200,
    ],
  });

  return (
    <View className="h-full">
      <ScrollView showsVerticalScrollIndicator={false} className="px-3">
        {users.length === 0 ? (
          <Text className="text-center font-bold text-xl mt-5">
            No users found.
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
            <Text className="mb-5 text-xl font-bold">All Users</Text>
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
                    {users
                      .map((user) => [
                        user._id,
                        user.email,
                        user.mobileNumber,
                        `${user.firstName || ""} ${user.lastName || ""}`,
                        user.username || "",
                        user?.image?.url ? (
                          <Image
                            source={{uri: user.image.url!}}
                            alt={user.image.public_id!}
                            className="h-[60px] max-w-[100px] rounded ml-[50px]"
                            resizeMode="cover"
                          />
                        ) : (
                          <></>
                        ),
                        new Date(user.dob).toLocaleDateString(),
                        user.gender || "",
                        user.city || "",
                        user.state || "",
                        user.country || "",
                        user.zip || "",
                        user.addressline || "",
                        user.role,
                        formatDistanceToNowStrict(user.createdAt) + " ago",
                        formatDistanceToNowStrict(user.updatedAt) + " ago",
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

export default ManageUsers;
