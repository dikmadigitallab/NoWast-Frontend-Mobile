import { AntDesign } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AudioPlayerProps {
  source: string | number;
}

export const AudioPlayer = ({ source }: AudioPlayerProps) => {

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    const s = status as AVPlaybackStatusSuccess;
    if (!isSeeking) {
      setDuration(s.durationMillis || 0);
      setPosition(s.positionMillis || 0);
    }
    if (s.didJustFinish) {
      setIsPlaying(false);
      sound?.stopAsync();
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!sound) {
        setIsLoading(true);
        const { sound: newSound } = await Audio.Sound.createAsync(
          typeof source === 'string' ? { uri: source } : source,
          { shouldPlay: true }
        );
        newSound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
        setSound(newSound);
        setIsPlaying(true);
        setIsLoading(false);
      } else {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
      setIsLoading(false);
    }
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSlidingStart = () => {
    setIsSeeking(true);
  };

  const handleSlidingComplete = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
    setIsSeeking(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPlaying ? styles.buttonPlaying : styles.buttonPaused]}
        onPress={handlePlayPause}
      >
        {isPlaying ? (
          <AntDesign name="pausecircle" size={24} color="#186B53" />
        ) : (
          <AntDesign name="play" size={24} color="#fff" />
        )}
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#186B53"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#186B53"
      />
      <Text style={styles.timeText}>{formatTime(position)}</Text>
      <Text style={styles.timeText}> / {formatTime(duration)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: "#F2F3F5",
    borderRadius: 100
  },
  button: {
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPlaying: {
    backgroundColor: '#D8D8D8',
  },
  buttonPaused: {
    backgroundColor: '#186B53',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  slider: {
    width: 100,
    height: 40,
  },
});
