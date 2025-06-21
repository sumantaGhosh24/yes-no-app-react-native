import {useState} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import {Entypo} from "@expo/vector-icons";

interface FormFieldProps {
  title: string;
  value: any;
  placeholder: string;
  handleChangeText: any;
  otherStyles?: any;
  type?: "password";
  custom?: any;
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  custom,
  type,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`space-y-2 ${otherStyles || ""}`}>
          <Text className="text-base font-bold">{title}</Text>
          <View
            className={`w-full px-4 rounded-2xl border-2 border-black-200 flex flex-row items-center ${
              custom ? "h-32" : "h-16"
            }`}
          >
            <TextInput
              className="flex-1 font-semibold text-base"
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#000"
              onChangeText={handleChangeText}
              secureTextEntry={type === "password" && !showPassword}
              style={{verticalAlign: "top"}}
              multiline={custom && true}
              numberOfLines={custom && 10}
              {...props}
            />
            {type === "password" && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Entypo name="eye" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default FormField;
