import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const managers = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior RM",
    tasks: 12,
    progress: 75,
    status: "active",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Senior RM",
    tasks: 12,
    progress: 75,
    status: "active",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
  },
];

const StatusBadge = ({ status }: { status: boolean }) => {
  console.log(`🚀 ~ status:`, status);
  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: status ? "#e8f5e9" : "#fff3e0" },
      ]}
    >
      <Text
        style={[styles.statusText, { color: status ? "#2e7d32" : "#f57c00" }]}
      >
        {status ? "Active" : "Inactive"}
      </Text>
    </View>
  );
};

const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
    </View>
  );
};

const RelationshipManagersList = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/admin/rms");
      return response.data;
    },
    initialData: [],
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relationship Managers</Text>
        <TouchableOpacity>
          <Text style={styles.addButton}>ADD</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {data.map((manager: any) => {
          const progress = Math.floor(
            (manager?.assignedTasks?.filter(
              (task: any) => task?.status === "COMPLETED"
            )?.length ?? 0 / manager?.assignedTasks?.length) * 100
          );
          return (
            <View key={manager.id} style={styles.managerCard}>
              <View style={styles.managerInfo}>
                <Image
                  source={{
                    uri:
                      manager.image ??
                      "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.managerName}>{manager.name}</Text>
                  <Text style={styles.managerTitle}>{manager.email}</Text>
                  <Text style={styles.tasks}>
                    {manager?.assignedTasks?.length} Tasks
                  </Text>
                  <ProgressBar percentage={progress} />
                </View>
                <View style={styles.rightContent}>
                  <StatusBadge status={manager.isActive} />
                  <Text style={styles.percentage}>{progress} %</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    color: "#2196f3",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  managerCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  managerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  managerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  managerTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  tasks: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  percentage: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginTop: 8,
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2196f3",
    borderRadius: 2,
  },
});

export default RelationshipManagersList;
