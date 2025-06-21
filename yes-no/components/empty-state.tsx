import {View, Text} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";
import {useColorScheme} from "nativewind";

import CustomButton from "./custom-button";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonTitle: string;
  handlePress: any;
}

const EmptyState = ({
  title,
  subtitle,
  buttonTitle,
  handlePress,
}: EmptyStateProps) => {
  const {colorScheme} = useColorScheme();

  return (
    <View className="flex justify-center items-center p-4 w-[80%] mx-auto border border-secondary rounded bg-white dark:bg-black">
      <FontAwesome6
        name="hourglass-empty"
        size={48}
        color={colorScheme === "dark" ? "white" : "black"}
      />
      <Text className="text-sm font-medium my-3 text-black dark:text-white capitalize">
        {title}
      </Text>
      <Text className="text-xl text-center font-semibold text-black dark:text-white capitalize">
        {subtitle}
      </Text>
      <CustomButton
        title={buttonTitle}
        handlePress={handlePress}
        containerStyles="w-full my-5 bg-blue-700"
      />
    </View>
  );
};

export default EmptyState;
