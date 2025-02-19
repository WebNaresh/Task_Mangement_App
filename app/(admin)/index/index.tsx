import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router";
import type React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  value: string;
  color: string;
  link: string;
}

interface PriorityItemProps {
  name: string;
  color: string;
  number: number;
}

interface PriorityData {
  color: string;
  createdAt: string;
  id: string;
  name: string;
  number: number;
  updatedAt: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color,
  link,
}) => (
  <Link href={link as any} style={[styles.card, { backgroundColor: "white" }]}>
    <View style={[]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  </Link>
);
const PriorityItem: React.FC<PriorityItemProps> = ({ name, color, number }) => (
  <View style={styles.priorityRow}>
    <Text style={styles.priorityName}>{name}</Text>
    <Text style={styles.priorityNumber}>{number}</Text>
    <View style={styles.colorSection}>
      <Text style={styles.colorLabel}>Color</Text>
      <View style={[styles.colorBar, { backgroundColor: color }]} />
    </View>
  </View>
);

const TaskDashboard: React.FC = () => {
  const { data, isLoading, isError } = useQuery<PriorityData[]>({
    queryKey: ["priority"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/priority");
      return response.data;
    },
  });

  const { data: stat } = useQuery({
    queryKey: ["stat"],
    queryFn: async () => {
      const response = await axios.get("/api/v1/task/statistics");
      return response.data;
    },
    initialData: null,
  });
  console.log(`🚀 ~ stat :`, stat);

  const stats: StatCardProps[] = [
    {
      icon: "format-list-checks",
      title: "Total Tasks",
      value: "24",
      color: "#4285F4",
      link: "/(admin)/index/manager",
    },
    {
      icon: "alert",
      title: "No Updates",
      value: "5",
      color: "#FFA000",
      link: "/(admin)/index/manager",
    },
    {
      icon: "clock-alert",
      title: "Delayed",
      value: "3",
      color: "#DB4437",
      link: "/(admin)/index/manager",
    },
    {
      icon: "account-group",
      title: "RM",
      value: "3",
      color: "#673AB7",
      link: "/manager",
    },
    {
      icon: "check-circle",
      title: "Completed",
      value: "16",
      color: "#0F9D58",
      link: "/(admin)/index/manager",
    },
    {
      icon: "format-list-bulleted",
      title: "Tasklist",
      value: "8",
      color: "#DB4437",
      link: "/(admin)/index/manager",
    },
    {
      icon: "account",
      title: "Client",
      value: "8",
      color: "#673AB7",
      link: "/client",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statSection}>
        <View style={styles.statGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>
      </View>

      <View style={styles.prioritySection}>
        <View style={styles.priorityHeader}>
          <Text style={styles.priorityTitle}>Priorities</Text>
          <Link href={"/modal"} style={styles.addPriority}>
            Add Priority
          </Link>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#4285F4"
            style={styles.loader}
          />
        ) : isError ? (
          <Text style={styles.errorText}>Error loading priorities</Text>
        ) : (
          data?.map((priority) => (
            <PriorityItem
              key={priority.id}
              name={priority.name}
              color={priority.color}
              number={priority.number}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  statSection: {
    padding: 16,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  prioritySection: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  priorityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priorityTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addPriority: {
    color: "#4285F4",
    fontSize: 16,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  priorityName: {
    flex: 1,
    fontSize: 16,
  },
  priorityNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 16,
  },
  colorSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorLabel: {
    marginRight: 8,
    color: "#666",
  },
  colorBar: {
    width: 100,
    height: 8,
    borderRadius: 4,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "#DB4437",
    textAlign: "center",
    padding: 16,
  },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default TaskDashboard;
