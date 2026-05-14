import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { DrawerProps } from "./Drawer.types";

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close drawer"
      />

      <View style={styles.sheet}>
        {/* Handle indicator */}
        <View style={styles.handle} accessibilityElementsHidden />

        {/* Header */}
        <View style={styles.header}>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <View />
          )}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2A2A2A",
    maxHeight: "80%",
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2A2A2A",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FAFAFA",
    flex: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#171717",
  },
  closeIcon: {
    fontSize: 14,
    color: "#A3A3A3",
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 20,
  },
});
