import NBModal from "@/components/ui/modal";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Modal = () => {
  return (
    <NBModal back_link="/tasks/index">
      <View>
        <Text>Modal</Text>
      </View>
    </NBModal>
  );
};

export default Modal;

const styles = StyleSheet.create({});
