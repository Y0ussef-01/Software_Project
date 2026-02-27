import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Index() {
  const [showpassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [useID, setUserID] = useState("");

  const [errors, setErrors] = useState<{ useID?: string; password?: string }>(
    {},
  );

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!useID) {
      errors.useID = "Invalid user ID";
    }

    if (!password) {
      errors.password = "Invalid password";
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    } else {
      setErrors({});
      router.replace("/home");
      return true;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "rgb(23, 42, 70)" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar style="light" />
          <Stack.Screen
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: "rgb(23, 42, 70)" },
            }}
          />
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/images/logo (2) (1).png")}
              style={styles.image}
            />
            <View style={styles.headerIconsContainer}>
              <Pressable style={styles.iconButton}>
                <Ionicons name="globe-outline" size={20} color="white" />
                <Text style={styles.languageText}>En</Text>
              </Pressable>

              <Pressable style={styles.iconButton}>
                <Ionicons name="help-circle-outline" size={24} color="white" />
              </Pressable>
            </View>
          </View>
          <View style={styles.offWhiteContainer}>
            <View>
              <View style={styles.form}>
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  <Text
                    style={{ color: "gray", fontSize: 12, marginBottom: 5 }}
                  >
                    EG Cairo - Egypt
                  </Text>
                  <Text style={styles.universityText}>
                    Welcome to Cairo university
                  </Text>
                  <Text
                    style={{
                      color: "rgb(23, 42, 70)",
                      fontSize: 14,
                      marginTop: 5,
                    }}
                  >
                    Sign in to your account
                  </Text>
                </View>
                <Text style={styles.text}>User ID</Text>
                <View style={[styles.passwordContainer,]}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="gray"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    placeholder="Enter your userID"
                    placeholderTextColor="#999"
                    style={styles.textInput}
                    value={useID}
                    onChangeText={setUserID}
                  />
                </View>

                {errors.useID && (
                  <Text style={{ color: "red", marginBottom: 15 ,fontSize:12}}>{errors.useID}</Text>
                )}

                <Text style={styles.text}>Password</Text>
                <View style={styles.passwordContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="gray"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showpassword}
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    underlineColorAndroid="transparent"
                  />

                  <Pressable onPress={() => setShowPassword(!showpassword)}>
                    <Ionicons
                      name={showpassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="gray"
                    />
                  </Pressable>
                </View>

                {errors.password && (
                  <Text style={{ color: "red", marginBottom: 15 ,fontSize:12}}>{errors.password}</Text>
                )}

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                  onPress={validateForm}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <Text style={styles.footerText}>© Since 1925</Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 30 : 40,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  headerIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  languageText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  form: {
    padding: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgb(23, 42, 70)",
    marginBottom: 5,
  },
  textInput: {
    flex: 1,
    flexDirection: "row",
    minHeight: 40,
    borderColor: "gray",
    borderRadius: 8,

    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "rgb(23, 42, 70)",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgb(224, 224, 224)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    minHeight: 45,
    backgroundColor: "rgb(250, 250, 250)",
  },
  passwordInput: {
    flex: 1,
    minHeight: 40,
    marginBottom: 1,
    borderColor: "gray",
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 80,
    alignItems: "center",
    resizeMode: "contain",
  },
  universityText: {
    color: "rgb(23, 42, 70)",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.7,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "rgb(23, 42, 70)",
  },
  offWhiteContainer: {
    backgroundColor: "rgb(244, 245, 248)",
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 40,
  },
});
