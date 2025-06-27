import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-primary relative">
      {/* Background image */}
      <Image source={images.bg} className="absolute w-full h-full z-0" resizeMode="cover" />

      {/* Content */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
      >
        {/* Logo */}
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 self-center" resizeMode="contain" />
        
        {/* Add your other components here */}
      </ScrollView>
    </SafeAreaView>
  );
}
