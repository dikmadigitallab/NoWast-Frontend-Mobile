import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import MapView, { Marker, Region, MapViewProps as RNMapViewProps } from "react-native-maps";

export type LatLng = { latitude: number; longitude: number };

export type MapProps = {
  style?: StyleProp<ViewStyle>;
  initialRegion: Region;
  marker?: LatLng | null;
  markers?: Array<{
    id?: string | number;
    position: LatLng;
    image?: ImageSourcePropType;
    onPress?: () => void;
  }>;
};

export type MapHandle = {
  animateToRegion: (region: Region, durationMs?: number) => void;
};

const Map = forwardRef<MapHandle, MapProps>(({ style, initialRegion, marker, markers }, ref) => {
  const innerRef = useRef<MapView | null>(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region: Region, durationMs?: number) => {
      innerRef.current?.animateToRegion(region, durationMs);
    },
  }));

  return (
    <MapView ref={innerRef} style={style as RNMapViewProps["style"]} initialRegion={initialRegion}>
      {marker && <Marker coordinate={marker} />}
      {markers?.map((m, index) => (
        <Marker
          key={m.id ?? index}
          coordinate={m.position}
          onPress={m.onPress}
          image={m.image as any}
        />
      ))}
    </MapView>
  );
});

export default Map;


