import { PriorityData } from "@/app/(admin)/dashboard";
import NBTextInput from "@/components/input/text-input";
import NBButton from "@/components/ui/button";
import { error_color, success_color } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import Toast from "react-native-root-toast";
import { z } from "zod";

const form_schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Task title must be at least 3 characters long" }),
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters long" }),
  dueDate: z
    .string()
    .trim()
    .min(3, { message: "Due date must be at least 3 characters long" }),
  taskListId: z
    .string()
    .trim()
    .min(3, { message: "Tasklist must be at least 3 characters long" }),
  responsibleUserId: z
    .string()
    .trim()
    .min(3, { message: "Assigned RM must be at least 3 characters long" }),
  clientId: z
    .string()
    .trim()
    .min(3, { message: "Client must be at least 3 characters long" }),
  priorityId: z
    .string()
    .trim()
    .min(3, { message: "Priority must be at least 3 characters long" }),
  assignedById: z
    .string()
    .trim()
    .min(3, { message: "Assigned by must be at least 3 characters long" }),
});

type Form = z.infer<typeof form_schema>;

type Props = {
  clients: any[];
  managers: any[];
  tasklists: any[];
  priorities: PriorityData[];
  assignedById: string;
};

const AddTaskForm = (props: Props) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const form = useForm<Form>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      title: "First",
      description: "First Description",
      dueDate: "",
      taskListId: "",
      responsibleUserId: "",
      clientId: "",
      priorityId: "",
      assignedById: props.assignedById,
    },
  });
  const router = useRouter();
  const query_client = useQueryClient();

  const { handleSubmit, formState, reset } = form;
  console.log(`🚀 ~ formState.errors:`, formState.errors);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
    setRefreshing(false);
  }, [reset]);

  const onSubmit = (data: Form) => {
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Form) => {
      //  axios request here /api/v1/task
      const response = await axios.post("/api/v1/task", data);
      console.log(`🚀 ~ response:`, response);
      return response.data;
    },
    onSuccess(data, variables, context) {
      query_client.invalidateQueries({
        queryKey: ["tasks"],
      });
      Toast.show("Task created successfully", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: success_color,
      });
      router.back();
    },
    onError(error, variables, context) {
      if (isAxiosError(error)) {
        console.error(`🚀 ~ error.response.data:`, error?.response?.data);
        Toast.show(error?.response?.data?.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: error_color,
        });
      }
    },
  });
  console.log(`🚀 ~ isPending:`, isPending);

  return (
    <ScrollView
      contentContainerStyle={[
        { paddingBottom: 26 },
        isDarkMode && styles.darkContainer,
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <NBTextInput
        form={form}
        name="title"
        placeholder="Enter task title"
        type="text"
        icon={
          <Feather
            name="clipboard"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        }
      />
      <NBTextInput
        form={form}
        name="description"
        placeholder="Enter description"
        type="textarea"
        icon={
          <Feather
            name="file-text"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        }
      />
      <NBTextInput
        form={form}
        name="taskListId"
        placeholder="Enter tasklist"
        type="select"
        icon={
          <Feather
            name="list"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        }
        options={props.tasklists.map((tasklist) => ({
          label: tasklist.name,
          value: tasklist.id,
        }))}
      />
      <NBTextInput
        form={form}
        name="dueDate"
        placeholder="Enter due date"
        type="date"
        icon={
          <Feather
            name="calendar"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        }
      />
      <NBTextInput
        form={form}
        name="responsibleUserId"
        placeholder="Enter assigned RM"
        type="select"
        icon={
          <Feather
            name="user"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        }
        options={props.managers.map((manager) => ({
          label: manager.name,
          value: manager.id,
        }))}
      />
      <NBTextInput
        form={form}
        name="clientId"
        placeholder="Enter client"
        type="select"
        icon={
          <Feather
            name="briefcase"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        }
        options={props.clients.map((client) => ({
          label: client.name,
          value: client.id,
        }))}
      />
      <NBTextInput
        form={form}
        name="priorityId"
        placeholder="Enter priority"
        type="select"
        icon={
          <Feather
            name="star"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        }
        options={props.priorities.map((priority) => ({
          label: priority.name,
          value: priority.id,
        }))}
      />

      <NBButton
        text="Create Task"
        onPress={handleSubmit(onSubmit)}
        isPending={formState.isSubmitting || isPending}
      />
    </ScrollView>
  );
};

export default AddTaskForm;

const styles = StyleSheet.create({
  darkContainer: {
    backgroundColor: "#000",
  },
});
