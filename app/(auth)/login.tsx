import { useAuth } from "@/auth/authProvider";
import { Bangers_400Regular, useFonts } from "@expo-google-fonts/bangers";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Button, TextInput } from "react-native-paper";

const { width } = Dimensions.get("window");

interface ProtectRouteProps {
  children: React.ReactNode;
}

export default function ProtectRoute({ children }: ProtectRouteProps) {
  const [seePassword, setSeePassword] = useState(true);
  const [fontsLoaded] = useFonts({ Bangers_400Regular });

  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: "grupo_dikma@gmail", password: "ddasddSD!@dsdas", }, });

  const { login, isAuthenticated, loading } = useAuth();

  if (!fontsLoaded) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.form}>
            <View style={styles.containerLogo}>
              <Image
                style={styles.logo}
                source={require("../../assets/logos/logo.png")}
              />
            </View>

            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    theme={{ colors: { primary: "#00A614", outline: "#d9d9d9" } }}
                    textColor="#000"
                    style={styles.input}
                    label="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
                rules={{ required: true }}
              />
              <Text
                style={[
                  styles.error,
                  {
                    opacity: errors.email ? 1 : 0,
                    textAlign: "left",
                    color: "red",
                    fontSize: 10
                  },
                ]}
              >
                Email é obrigatório
              </Text>
            </View>

            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    secureTextEntry={seePassword}
                    theme={{ colors: { primary: "#00A614", outline: "#d9d9d9" } }}
                    textColor="#000"
                    style={styles.input}
                    label="Senha"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    right={
                      <TextInput.Icon
                        icon={() => (
                          <Feather
                            name={seePassword ? "eye-off" : "eye"}
                            size={19}
                            color="#000"
                          />
                        )}
                        onPress={() => setSeePassword(!seePassword)}
                      />
                    }
                  />
                )}
                name="password"
                rules={{ required: true }}
              />
              <Text
                style={[
                  styles.error,
                  {
                    opacity: errors.password ? 1 : 0,
                    textAlign: "left",
                    color: "red",
                    fontSize: 10
                  },
                ]}
              >
                Senha é obrigatória
              </Text>
            </View>

            <TouchableOpacity style={{ width: "100%" }}>
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={handleSubmit(login)}
          >
            <Button
              icon={!loading ? "login" : ""}
              mode="contained"
              style={styles.button}
            >
              <Text style={{ color: "#fff", fontSize: 15 }}>
                {loading ? (<ActivityIndicator size="small" color="#fff" />) : ("Entrar")}
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    borderRadius: 20,
    padding: 24,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#d9d9d9",
    shadowColor: "#000",
  },
  containerLogo: {
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 170,
    objectFit: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 50,
    fontSize: 13,
    width: width * 0.8,
    backgroundColor: "#fff",
  },
  error: {
    marginTop: 5,
    width: width * 0.8,
    color: "#0000004f",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00A614",
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  forgotPassword: {
    textAlign: "center",
    color: "#385866",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
});