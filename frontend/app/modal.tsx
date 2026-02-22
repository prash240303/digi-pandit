import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Text } from "@/components/ui/text";

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <Text variant="h1">This is a modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text variant="h2">Go to home screen</Text>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
