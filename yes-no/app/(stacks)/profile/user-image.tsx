import {useState} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {FontAwesome5} from "@expo/vector-icons";
import axios from "axios";

import {useAuth} from "@/context/auth-context";
import {BASE_URL} from "@/constants";
import CustomButton from "@/components/custom-button";

const ProfileUserImage = () => {
  const {authState, addUserImage} = useAuth();

  const [upload, setUpload] = useState(false);
  const [avatar, setAvatar] = useState<any>();

  const openPicker = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (pickerResult.canceled === true) {
      return;
    }

    setAvatar({
      uri: pickerResult.assets[0].uri,
      type: pickerResult.assets[0].mimeType,
      name: pickerResult.assets[0].fileName,
    });
  };

  const handleSubmit = async () => {
    if (!avatar) {
      return ToastAndroid.showWithGravityAndOffset(
        "First select an image!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    setUpload(true);
    try {
      if (authState?.image.url) {
        await axios.post(
          `${BASE_URL}/destroy`,
          {public_id: authState?.image.public_id},
          {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
        );
      }

      const formData = new FormData();
      formData.append("file", avatar);
      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${authState?.accesstoken}`,
        },
      });

      addUserImage!(
        {url: response.data.url, public_id: response.data.public_id},
        authState?.accesstoken!
      );
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        "Something went wrong, try again later!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setUpload(false);
    }
  };

  return (
    <ScrollView
      className="mt-5 h-full px-3"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold my-5">Profile Update User Image</Text>
      {authState?.image?.url && (
        <Image
          source={{uri: authState?.image?.url as string}}
          alt="avatar"
          className="h-48 w-full rounded"
        />
      )}
      <View className="my-5 space-y-2">
        <Text className="text-base font-bold">User Image</Text>
        <TouchableOpacity onPress={() => openPicker()}>
          {avatar ? (
            <Image
              source={{uri: avatar.uri}}
              resizeMode="cover"
              className="w-full h-64 rounded-2xl"
            />
          ) : (
            <View className="w-full h-16 px-4 rounded-2xl border-2 bg-gray-700 flex justify-center items-center flex-row space-x-2">
              <FontAwesome5 name="cloud-upload-alt" size={24} color="white" />
              <Text className="text-sm font-bold text-white">
                Choose a file
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <CustomButton
        title="Update Image"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={upload}
      />
    </ScrollView>
  );
};

export default ProfileUserImage;
