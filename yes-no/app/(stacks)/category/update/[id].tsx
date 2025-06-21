import {useEffect, useState} from "react";
import {Image, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

import FormField from "@/components/form-field";
import CustomButton from "@/components/custom-button";
import {BASE_URL} from "@/constants";
import {useAuth} from "@/context/auth-context";
import {FontAwesome5} from "@expo/vector-icons";

interface CategoryProps {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

const UpdateCategory = () => {
  const {id} = useLocalSearchParams();
  const {authState} = useAuth();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<CategoryProps>();
  const [name, setName] = useState("");
  const [image, setImage] = useState<any>();

  const getCategory = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}/category/${id}`);

      if (response.data.success === true) {
        setCategory(response.data.category);
        setName(response.data.category.name);
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
    getCategory();
  }, [authState?.accesstoken]);

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

    setImage({
      uri: pickerResult.assets[0].uri,
      type: pickerResult.assets[0].mimeType,
      name: pickerResult.assets[0].fileName,
    });
  };

  const handleSubmit = async () => {
    if (name === "")
      return ToastAndroid.showWithGravityAndOffset(
        "Fill all fields!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

    setLoading(true);
    try {
      if (image) {
        await axios.post(
          `${BASE_URL}/destroy`,
          {public_id: category?.image?.public_id},
          {headers: {Authorization: `Bearer ${authState?.accesstoken}`}}
        );

        const formData = new FormData();
        formData.append("file", image);
        const response = await axios.post(`${BASE_URL}/upload`, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${authState?.accesstoken}`,
          },
        });

        const res = await axios.put(
          `${BASE_URL}/category/${id}`,
          {
            name,
            image: {
              url: response.data.secure_url,
              public_id: response.data.public_id,
            },
          },
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
          getCategory();
        }
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/category/${id}`,
        {name},
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
        getCategory();
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
      <Text className="text-2xl font-bold my-5">Update Category</Text>
      {category?.image?.url && (
        <Image
          source={{uri: category?.image.url}}
          alt="avatar"
          className="h-48 w-full rounded"
        />
      )}
      <View className="my-5 space-y-2">
        <Text className="text-base font-bold">Category Image</Text>
        <TouchableOpacity onPress={() => openPicker()}>
          {image ? (
            <Image
              source={{uri: image.uri}}
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
      <FormField
        title="Category Name"
        placeholder="Enter category name"
        value={name}
        handleChangeText={(text: any) => setName(text)}
        otherStyles="mb-3"
      />
      <CustomButton
        title="Update Category"
        handlePress={handleSubmit}
        containerStyles="bg-blue-700 disabled:bg-blue-300 mb-5"
        isLoading={loading}
      />
    </View>
  );
};

export default UpdateCategory;
