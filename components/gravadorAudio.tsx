import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AudioRecorderPlayerProps {
  onRecordingComplete?: (uri: string) => void;
  onRemove?: () => void;
}

export default function AudioRecorderPlayer({ onRecordingComplete, onRemove }: AudioRecorderPlayerProps) {

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
      recording?.stopAndUnloadAsync();
    };
  }, [sound, recording]);

  const startRecording = async () => {

    setRecordedUri(null);
    setIsRecording(false);

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      if (uri) {
        setRecordedUri(uri);
        if (onRecordingComplete) {
          onRecordingComplete(uri);
        }
      }
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

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

  const handlePlayStop = async () => {
    try {
      if (!recordedUri) return;

      if (!sound || !isPlaying) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recordedUri },
          { shouldPlay: true },
          handlePlaybackStatusUpdate
        );
        setSound(newSound);
        setIsPlaying(true);
      } else {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
    }
  };

  const handleRemove = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
      setPosition(0);
      setRecordedUri(null);

      // Remove o arquivo gravado
      if (recordedUri) {
        await FileSystem.deleteAsync(recordedUri);
      }

      if (onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error('Erro ao remover o áudio:', error);
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

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <View style={styles.containerFile}>

      <View style={styles.headerFoto}>
        <FontAwesome name="microphone" size={24} color="#43575F" />
        <Text style={styles.textFoto}>Adicionar Gravação</Text>
      </View>

      <View style={styles.container}>

        <TouchableOpacity
          style={[styles.button, isRecording ? styles.buttonRecording : styles.buttonRecord]}
          onPress={toggleRecording}
        >
          <MaterialIcons
            name={isRecording ? "stop" : "mic"}
            size={24}
            color={isRecording ? "#FF3B30" : "#fff"}
          />
        </TouchableOpacity>

        {
          !isRecording && !recordedUri && (
            <Text style={{ color: "#404944", fontSize: 14, fontWeight: 'bold' }}>Clique aqui para iniciar a gravação</Text>
          )
        }

        {
          isRecording && (
            <Text style={{ color: "#404944", fontSize: 14, fontWeight: 'bold' }}>Gravando...</Text>
          )
        }

        {recordedUri && (
          <View>
            <TouchableOpacity
              style={[styles.button, isPlaying ? styles.buttonPlaying : styles.buttonPaused]}
              onPress={handlePlayStop}
            >
              {isPlaying ? (
                <Entypo name="controller-stop" size={24} color="#186B53" />
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
              disabled={!recordedUri}
            />

            <Text style={styles.timeText}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemove}
            >
              <MaterialIcons name="delete" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  containerFile: {
    gap: 10,
    width: "100%",
    marginVertical: 10,
    flexDirection: "column"
  },
  headerFoto: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textFoto: {
    fontSize: 14,
    color: "#43575F",
    fontWeight: "600"
  },
  button: {
    padding: 15,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRecord: {
    backgroundColor: '#FF3B30',
  },
  buttonRecording: {
    backgroundColor: '#D8D8D8',
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
    minWidth: 100,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  removeButton: {
    padding: 5,
  }
});