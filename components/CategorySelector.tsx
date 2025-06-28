import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Category {
  name: string;
  filter: any;
}

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (category: Category) => void;
}

const CategorySelector = ({ categories, selected, onSelect }: Props) => (
  <View className="flex-row flex-wrap gap-3 mt-5 justify-center">
    {categories.map((cat) => (
      <TouchableOpacity
        key={cat.name}
        onPress={() => onSelect(cat)}
        className={`px-4 py-2 rounded-2xl shadow-md ${
          selected === cat.name ? "bg-blue-600" : "bg-gray-800"
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            selected === cat.name ? "text-white" : "text-gray-200"
          }`}
        >
          {cat.name}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default CategorySelector;
