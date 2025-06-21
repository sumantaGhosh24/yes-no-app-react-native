import {ActivityIndicator, TouchableOpacity} from "react-native";

interface IconButtonProps {
  icon: any;
  containerStyles?: any;
  handlePress?: any;
  isLoading?: boolean;
}

const IconButton = ({
  icon,
  containerStyles,
  handlePress,
  isLoading,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`mt-2.5 p-1.5 rounded flex flex-row-reverse ${
        containerStyles || ""
      } ${isLoading ? "opacity-50" : "opacity-100"}`}
      disabled={isLoading}
    >
      {icon}
      {isLoading && (
        <ActivityIndicator animating={isLoading} color="#fff" size="small" />
      )}
    </TouchableOpacity>
  );
};

export default IconButton;
