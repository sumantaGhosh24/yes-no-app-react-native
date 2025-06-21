import {ReactNode, useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {FontAwesome} from "@expo/vector-icons";

interface AccordionItemProps {
  children: ReactNode;
  title: string;
}

const AccordionItem = ({children, title}: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleItem = () => setExpanded(!expanded);

  return (
    <View className="pb-1">
      <TouchableOpacity
        className="p-3 bg-gray-500 text-black flex flex-row justify-between rounded"
        onPress={toggleItem}
      >
        <Text className="text-xl text-white">{title}</Text>
        <FontAwesome
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="black"
        />
      </TouchableOpacity>
      {expanded && <View className="p-3">{children}</View>}
    </View>
  );
};

export default AccordionItem;
