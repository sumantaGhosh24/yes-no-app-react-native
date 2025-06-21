import {
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
} from "react-native";

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({isLoading}: LoaderProps) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="flex justify-center items-center w-full z-50 bg-black/30 absolute top-0 left-0"
      style={{height: screenHeight}}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#1D4ED8"
        size={osName === "ios" ? "large" : 50}
      />
      <Text className="text-[#1D4ED8] text-lg font-bold">Loading...</Text>
    </View>
  );
};

export default Loader;
