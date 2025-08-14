export default {
  expo: {
    name: "YourAppName",
    slug: "dikmaapp",
    owner: "warlleimartins",
    android: {
      package: "com.yourcompany.nowast",
      usesCleartextTraffic: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    extra: {
      eas: {
        projectId: "31b8a7f8-00bf-4c85-a943-6ea6edafce18"
      }
    }
  }
};