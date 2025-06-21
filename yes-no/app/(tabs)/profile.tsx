import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";

import {useAuth} from "@/context/auth-context";

const Profile = () => {
  const {authState} = useAuth();

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {authState && (
          <View className="px-5 min-h-screen">
            {authState?.image.url && (
              <View className="flex-row items-center justify-center my-5">
                <Image
                  source={{uri: authState?.image.url}}
                  className="w-[200px] h-[200px] rounded-full"
                />
              </View>
            )}
            {authState?.firstName && (
              <>
                <View className="flex-row items-center justify-center">
                  <Text className="text-xl font-bold capitalize">
                    {authState?.firstName} {authState?.lastName}
                  </Text>
                </View>
                <View className="flex-row items-center justify-center">
                  <Text className="text-lg font-bold">
                    {authState?.username}
                  </Text>
                </View>
              </>
            )}
            <View className="flex-row items-center justify-center mb-5">
              <Text className="text-base">{authState?.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/profile/details")}
              className="mb-3 flex flex-row items-center justify-between"
            >
              <View className="flex flex-row items-center gap-3">
                <FontAwesome name="user" size={20} color="black" />
                <Text className="font-bold">Profile Details</Text>
              </View>
              <FontAwesome name="arrow-right" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile/user-image")}
              className="mb-3 flex flex-row items-center justify-between"
            >
              <View className="flex flex-row items-center gap-3">
                <FontAwesome name="image" size={20} color="black" />
                <Text className="font-bold">Profile Update Image</Text>
              </View>
              <FontAwesome name="arrow-right" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile/user-data")}
              className="mb-3 flex flex-row items-center justify-between"
            >
              <View className="flex flex-row items-center gap-3">
                <FontAwesome name="user-plus" size={20} color="black" />
                <Text className="font-bold">Profile Update User Data</Text>
              </View>
              <FontAwesome name="arrow-right" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile/user-address")}
              className="mb-3 flex flex-row items-center justify-between"
            >
              <View className="flex flex-row items-center gap-3">
                <FontAwesome name="user-secret" size={20} color="black" />
                <Text className="font-bold">Profile Update User Address</Text>
              </View>
              <FontAwesome name="arrow-right" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile/reset-password")}
              className="mb-3 flex flex-row items-center justify-between"
            >
              <View className="flex flex-row items-center gap-3">
                <FontAwesome name="lock" size={20} color="black" />
                <Text className="font-bold">Reset Password</Text>
              </View>
              <FontAwesome name="arrow-right" size={20} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
