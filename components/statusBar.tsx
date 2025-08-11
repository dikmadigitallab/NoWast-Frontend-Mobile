import React, { useState } from "react";
import { StatusBar, StatusBarStyle } from "react-native";

const STYLES = ["default", "dark-content", "light-content"] as const;
const TRANSITIONS = ["fade", "slide", "none"] as const;

export default function StatusBarComponent() {

  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(STYLES[2]);

  const [statusBarTransition, setStatusBarTransition] = useState<"fade" | "slide" | "none">(TRANSITIONS[0]);

  return (
    <StatusBar
      animated={true}
      hidden={false}
      backgroundColor="#186B53"
      barStyle={statusBarStyle}
      showHideTransition={statusBarTransition}
    />
  );
}
