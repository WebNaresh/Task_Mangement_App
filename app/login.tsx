import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import { error_color, primary_color, success_color } from "@/constants/Colors";
import useAuth from "@/hooks/useAuth";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod"; // Add this import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type form_schema_types = z.infer<typeof form_schema>;

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      width: "100%",
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    logoContainer: {
      marginBottom: 32,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: primary_color,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: "#A0A0A0",
      marginBottom: 48,
    },
    inputContainer: {
      width: "100%",
      gap: 16,
      marginBottom: 16,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#333333" : "#F5F5F5",
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 56,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? "#FFFFFF" : "#000000",
      marginLeft: 12,
    },
    eyeIcon: {
      padding: 4,
    },
    forgotPassword: {
      color: primary_color,
      fontSize: 14,
      marginBottom: 24,
    },
  });

  const form = useForm<form_schema_types>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
  });
  const { mutate } = useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      const response = await axios.put(
        `/api/v1/auth/update-user-status/${user?.id}`,
        data
      );

      return response.data;
    },
  });
  const { handleSubmit } = form;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: form_schema_types) => {
      await queryClient.invalidateQueries({
        queryKey: ["token"],
      });
      const response = await axios.post("/api/v1/auth/login", data);
      return response.data;
    },
    async onSuccess(data, _variables, _context) {
      Toast.show(`Welcome, ${data?.name}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success_color,
      });

      if (data.role === "RM") {
        await AsyncStorage.setItem("token", data.token);
        await queryClient.invalidateQueries({
          queryKey: ["token"],
        });
        router.push("/(manager)/dashboard");
      } else if (data.role === "ADMIN") {
        router.push("/(admin)/dashboard");
        await AsyncStorage.setItem("token", data.token);
        await queryClient.invalidateQueries({
          queryKey: ["token"],
        });
      }

      mutate({ isActive: true });

      // if data role is other than RM or ADMIN
      if (data.role !== "RM" && data.role !== "ADMIN") {
        Toast.show("You are not authorized to login", {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          backgroundColor: error_color,
        });
      }
    },
    onError(error, variables, context) {
      if (axios.isAxiosError(error)) {
        Toast.show(error.response?.data.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          backgroundColor: error_color,
        });
      }
    },
  });

  const onSubmit = (data: form_schema_types) => {
    mutation.mutate(data);
  };

  if (token !== null) {
    if (user?.role === "ADMIN") {
      return <Redirect href={"/(admin)/dashboard"} />;
    } else {
      return <Redirect href="/(manager)/dashboard" />;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="checkmark" size={40} color="#FFFFFF" />
            </View>
          </View>

          {/* Welcome Text */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to Continue</Text>

          {/* Input Fields */}
          <NBTextInput
            form={form}
            name="email"
            placeholder="eg. admin@gmail.com"
            icon={
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#A0A0A0"
              />
            }
            type="text"
          />
          <NBTextInput
            form={form}
            name="password"
            placeholder="Pass@123"
            icon={
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="#A0A0A0"
              />
            }
            type="password"
          />

          <NBButton
            onPress={handleSubmit(onSubmit)}
            isPending={mutation.isPending}
            text="Login"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
