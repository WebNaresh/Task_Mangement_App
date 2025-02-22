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
      {/* modal */}
      <Stack.Screen
        name="[task_id]/edit/modal"
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
