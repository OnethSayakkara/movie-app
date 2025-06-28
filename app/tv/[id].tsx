import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";

import { icons } from "@/constants/icons";
import { fetchTVSeriesDetails, fetchTVSeriesVideos } from "@/services/api";

interface InfoRowProps {
  label: string;
  value?: string | number | null;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const TVSeriesDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tvDetails, setTvDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trailer, setTrailer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (!id) throw new Error("No TV Series ID provided");
        const data = await fetchTVSeriesDetails(id);
        setTvDetails(data);
      } catch (err: any) {
        setError(err.message || "Failed to load TV series details");
      } finally {
        setLoading(false);
      }
    };

    const loadVideos = async () => {
      try {
        if (!id) return;
        const videoData = await fetchTVSeriesVideos(id);
        const video =
          videoData.results.find(
            (v: any) => v.type === "Trailer" && v.site === "YouTube"
          ) ||
          videoData.results.find(
            (v: any) => v.type === "Teaser" && v.site === "YouTube"
          ) ||
          videoData.results.find(
            (v: any) => v.type === "Clip" && v.site === "YouTube"
          ) ||
          videoData.results.find((v: any) => v.site === "YouTube");

        setTrailer(video || null);
      } catch {
        setTrailer(null);
      }
    };

    loadDetails();
    loadVideos();
  }, [id]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center p-5 bg-primary">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1 bg-primary">
      <View>
        <Image
          source={{
            uri: tvDetails.poster_path
              ? `https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-full h-[550px]"
          resizeMode="stretch"
        />

        <TouchableOpacity
          className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
          onPress={() => {
            if (trailer) {
              setIsPlaying(true);
              setErrorMessage(null);
            } else {
              setErrorMessage("No trailer available.");
            }
          }}
        >
          <Image source={icons.play} className="w-6 h-7 ml-1" resizeMode="stretch" />
        </TouchableOpacity>

        {isPlaying && trailer && (
          <WebView
            style={{ width: "100%", height: 250, marginTop: 10 }}
            source={{
              uri: `https://www.youtube.com/embed/${trailer.key}?controls=1&autoplay=1`,
            }}
            javaScriptEnabled
            allowsInlineMediaPlayback
          />
        )}

        {errorMessage && (
          <Text className="text-light-200 mt-5 text-center">{errorMessage}</Text>
        )}
      </View>

      <View className="flex-col items-start justify-center mt-5 px-5 mb-10">
        <Text className="text-white text-xl font-bold mb-4">{tvDetails.name}</Text>

        <View className="flex-row items-center gap-x-2 mb-3">
          <Text className="text-light-300 text-sm">
            First Air Date: {tvDetails.first_air_date || "Unknown"}
          </Text>
          <Text className="text-light-300 text-sm">
            • {tvDetails.number_of_seasons} Seasons
          </Text>
          <Text className="text-light-300 text-sm">
            • {tvDetails.number_of_episodes} Episodes
          </Text>
        </View>

        <Text className="text-white text-base leading-relaxed mb-5">
          {tvDetails.overview || "No overview available."}
        </Text>

        <Text className="text-white font-bold text-lg mb-2">Seasons:</Text>
        {tvDetails.seasons?.map((season: any) => (
          <View
            key={season.id}
            className="mb-3 p-3 bg-dark-100 rounded-lg w-full"
          >
            <Text className="text-white font-semibold mb-1">
              Season {season.season_number} - Episodes: {season.episode_count}
            </Text>
            <Text className="text-light-200 text-sm">
              {season.overview || "No description available."}
            </Text>
          </View>
        ))}

        <InfoRow
          label="Genres"
          value={tvDetails.genres?.map((g: any) => g.name).join(" • ") || "N/A"}
        />
        <InfoRow
          label="Production Companies"
          value={
            tvDetails.production_companies
              ?.map((c: any) => c.name)
              .join(" • ") || "N/A"
          }
        />
        <InfoRow label="Status" value={tvDetails.status} />
        <InfoRow label="Original Language" value={tvDetails.original_language} />
      </View>
    </ScrollView>
  );
};

export default TVSeriesDetails;
