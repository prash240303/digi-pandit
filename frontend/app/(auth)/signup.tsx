import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useAuth } from "@/contexts";
import { Text } from "@/components/ui/text";
import { COLOR } from "@/constants/colors";

const inputStyle = {
  backgroundColor: COLOR.cream,
  color: COLOR.ink,
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: COLOR.creamDark,
  fontSize: 16,
  outlineWidth: 0,
} as const;

export default function SignUpScreen() {
  const { signUp, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password) { setError("Please enter a password"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }

    const result = await signUp({ email: email.trim(), password });
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      setError(result.error || "Sign up failed");
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLOR.cream }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 32,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center gap-3" style={{ marginBottom: 32 }}>
            <View
              className="rounded-full items-center justify-center"
              style={{
                width: 80,
                height: 80,
                backgroundColor: COLOR.terracotta + "15",
                borderWidth: 2,
                borderColor: COLOR.terracotta + "30",
              }}
            >
              <Text style={{ fontSize: 40 }}>🙏</Text>
            </View>
            <Text
              variant="h2"
              className="border-0"
              style={{
                color: COLOR.terracotta,
                fontFamily: Platform.select({
                  ios: "Georgia",
                  android: "serif",
                  web: "Georgia, serif",
                }),
                letterSpacing: -0.5,
              }}
            >
              DigiPandit
            </Text>
            <Text variant="muted" className="text-center" style={{ color: COLOR.inkMuted }}>
              Create your spiritual account
            </Text>
          </View>

          {/* # Sign Up Card  */}
          <View
            className="rounded-3xl p-6"
            style={{
              backgroundColor: COLOR.cardBg,
              borderWidth: 1,
              borderColor: COLOR.creamDark,
            }}
          >
            <View className="gap-4">
              {/* Email Field */}
              <View className="gap-1.5">
                <Text variant="small" className="font-semibold" style={{ color: COLOR.ink }}>
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={COLOR.inkLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={inputStyle}
                />
              </View>

              {/* Password Field */}
              <View className="gap-1.5">
                <Text variant="small" className="font-semibold" style={{ color: COLOR.ink }}>
                  Password
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password (min 8 chars)"
                  placeholderTextColor={COLOR.inkLight}
                  secureTextEntry
                  style={inputStyle}
                />
              </View>

              {/* Confirm Password Field */}
              <View className="gap-1.5">
                <Text variant="small" className="font-semibold" style={{ color: COLOR.ink }}>
                  Confirm Password
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor={COLOR.inkLight}
                  secureTextEntry
                  style={inputStyle}
                />
              </View>

              {/* Error Message */}
              {error ? (
                <View
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: "#FEE2E2",
                    borderWidth: 1,
                    borderColor: "#FECACA",
                  }}
                >
                  <Text variant="small" className="text-center" style={{ color: "#DC2626" }}>
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={handleSignUp}
                disabled={isLoading}
                activeOpacity={0.85}
                className="items-center justify-center"
                style={{
                  backgroundColor: isLoading ? COLOR.terracottaLight : COLOR.terracotta,
                  paddingVertical: 16,
                  borderRadius: 14,
                  marginTop: 8,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLOR.white} />
                ) : (
                  <Text variant="small" className="font-bold" style={{ color: COLOR.white }}>
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              {/* Terms */}
              <Text
                variant="muted"
                className="text-center leading-5 mt-1"
                style={{ color: COLOR.inkLight }}
              >
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>

          {/* Sign In Link */}
          <View className="flex-row items-center justify-center mt-6">
            <Text variant="muted" style={{ color: COLOR.inkMuted }}>
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text variant="small" className="font-bold" style={{ color: COLOR.terracotta }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}