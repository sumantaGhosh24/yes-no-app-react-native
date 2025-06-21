import {ActivityIndicator, Text, TouchableOpacity} from "react-native";

interface CustomButtonProps {
  title: string;
  handlePress: any;
  containerStyles?: any;
  textStyles?: any;
  isLoading?: boolean;
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl py-2.5 px-4 flex flex-row justify-center items-center ${
        containerStyles || ""
      } ${isLoading ? "opacity-50" : "opacity-100"}`}
      disabled={isLoading}
    >
      <Text className={`text-white font-semibold text-lg ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
