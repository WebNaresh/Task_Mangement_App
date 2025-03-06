import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add_task/index" options={{ headerShown: false }} />
      <Stack.Screen name="[task_id]/index" options={{ title: "Task Detail" }} />
      <Stack.Screen
        name="[task_id]/edit/index"
        options={{ title: "Edit Task" }}
      />
      <Stack.Screen
        name="[task_id]/delete/index"
        options={{
          presentation: "transparentModal",
          animation: "none", // Disable popping animation
          animationTypeForReplace: "push", // Ensure no popping animation
          headerShown: false,
        }}
      />
      {/* modal */}
      <Stack.Screen
        name="[task_id]/[user_id]/remark_modal"
        options={{
          presentation: "transparentModal",
          animation: "none", // Disable popping animation
          animationTypeForReplace: "push", // Ensure no popping animation
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[task_id]/[user_id]/[task_list_id]/status_modal"
        options={{
          presentation: "transparentModal",
          animation: "none", // Disable popping animation
          animationTypeForReplace: "push", // Ensure no popping animation
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default StackLayout;

const styles = StyleSheet.create({});
