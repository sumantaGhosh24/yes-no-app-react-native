import {View, Text, ScrollView, Image} from "react-native";

import {useAuth} from "@/context/auth-context";
import Loader from "@/components/loader";
import {formatDistanceToNowStrict} from "date-fns";

const ProfileDetails = () => {
  const {authState, loading} = useAuth();

  return (
    <ScrollView className="mt-5 px-3" showsVerticalScrollIndicator={false}>
      {loading && <Loader isLoading={loading} />}
      {authState?.image?.url && (
        <Image
          source={{uri: authState?.image?.url as string}}
          alt={authState?.image?.public_id as string}
          className="w-full h-[250px] rounded mb-4"
        />
      )}
      <View className="flex flex-row mb-4">
        <Text>User ID: </Text>
        <Text className="capitalize font-bold">{authState?._id}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text>Email Address: </Text>
        <Text className="font-bold">{authState?.email}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text>Mobile Number: </Text>
        <Text className="capitalize font-bold">{authState?.mobileNumber}</Text>
      </View>
      {authState?.firstName && (
        <>
          <View className="flex flex-row mb-4">
            <Text>First Name: </Text>
            <Text className="capitalize font-bold">{authState?.firstName}</Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text>Last Name: </Text>
            <Text className="capitalize font-bold">{authState?.lastName}</Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text>Username: </Text>
            <Text className="font-bold">{authState?.username}</Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text>DOB: </Text>
            <Text className="capitalize font-bold">
              {new Date(authState?.dob as string).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text>Gender: </Text>
            <Text className="capitalize font-bold">{authState?.gender}</Text>
          </View>
        </>
      )}
      {authState?.city && (
        <>
          <View className="flex flex-row mb-4">
            <Text>City: </Text>
            <Text className="capitalize font-bold">{authState?.city}</Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text>State: </Text>
            <Text className="capitalize font-bold">{authState?.state}</Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text>Country: </Text>
            <Text className="capitalize font-bold">{authState?.country}</Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text>Zip: </Text>
            <Text className="capitalize font-bold">{authState?.zip}</Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text>Addressline: </Text>
            <Text className="capitalize font-bold">
              {authState?.addressline}
            </Text>
          </View>
        </>
      )}
      <View className="flex flex-row mb-4">
        <Text>Role: </Text>
        <Text className="capitalize font-bold">{authState?.role}</Text>
      </View>
      <View className="flex flex-row mb-4">
        <Text>Created At: </Text>
        <Text className="capitalize font-bold">
          {new Date(authState?.createdAt as string).toLocaleDateString()} (
          {formatDistanceToNowStrict(authState?.createdAt as string)} ago)
        </Text>
      </View>
      <View className="flex flex-row mb-20">
        <Text>Updated At: </Text>
        <Text className="capitalize font-bold">
          {new Date(authState?.updatedAt as string).toLocaleDateString()} (
          {formatDistanceToNowStrict(authState?.updatedAt as string)} ago)
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileDetails;
