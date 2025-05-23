import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import NBModal from "@/components/ui/modal";
import { error_color, success_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View, useColorScheme } from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" }),
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters long" }),
});

type Form = z.infer<typeof form_schema>;

const TaskListModal = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const backgroundColor = isDarkMode ? "#121212" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#000";
  const router = useRouter();

  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const query_client = useQueryClient();

  const { handleSubmit } = form;
  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Form) => {
      const response = await axios.post("/api/v1/tasklist", data);
      return response.data;
    },
    async onSuccess(data, variables, context) {
      router.back();
      Toast.show("Task List Added", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: success_color,
      });
      await query_client.invalidateQueries({
        queryKey: ["tasklist"],
      });
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

  return (
    <NBModal onClose={() => router.back()}>
      <View
        style={[
          styles.container,
          { backgroundColor, borderRadius: 10, width: "100%" },
        ]}
      >
        <NBTextInput
          placeholder="Enter Name"
          form={form}
          name="name"
          type="text"
          icon={
            <Feather
              name="list"
              size={24}
              color={textColor}
              style={{ marginRight: 10 }}
            />
          }
        />
        <NBTextInput
          placeholder="Enter Description"
          form={form}
          name="description"
          type="text"
          icon={
            <Feather
              name="align-left"
              size={24}
              color={textColor}
              style={{ marginRight: 10 }}
            />
          }
        />
        <NBButton
          text="Add Task List"
          onPress={onSubmit}
          isPending={form.formState.isSubmitting || isPending}
          isDisabled={!form.formState.isDirty}
        />
      </View>
    </NBModal>
  );
};

export default TaskListModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
