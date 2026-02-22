import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts";
import { API_BASE_URL } from "@/services/api";
import { authService } from "@/services/auth";
import { Text } from "@/components/ui/text";
import { COLOR } from "@/constants/colors";

WebBrowser.maybeCompleteAuthSession();

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

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password) { setError("Please enter your password"); return; }
    const result = await signIn({ email: email.trim(), password });
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      setOauthLoading(true);
      setError("");

      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "digipandit",
        path: "(auth)/callback",
      });

      const response = await authService.getOAuthUrl(provider, redirectUrl);

      if (response.success && response.data?.url) {
        const oauthUrl = response.data.url;
        if (!oauthUrl || typeof oauthUrl !== "string" || !oauthUrl.startsWith("http")) {
          setError("Invalid OAuth URL received from server");
          return;
        }

        const result = await WebBrowser.openAuthSessionAsync(oauthUrl, redirectUrl);

        if (result.type === "success" && result.url) {
          const url = new URL(result.url);
          const accessToken =
            url.searchParams.get("access_token") ||
            url.hash?.match(/access_token=([^&]+)/)?.[1];

          if (accessToken) {
            const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/auth/oauth/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: accessToken }),
            });
            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              router.replace("/(tabs)");
              return;
            }
          }
          setError("Failed to complete authentication");
        } else if (result.type !== "cancel") {
          setError("Authentication was cancelled or failed");
        }
      } else {
        Alert.alert(
          "OAuth Setup Required",
          `To use ${provider === "google" ? "Google" : "Apple"} login:\n\n` +
            "1. Go to Supabase Dashboard → Authentication → Providers\n" +
            `2. Enable ${provider === "google" ? "Google" : "Apple"} provider\n` +
            "3. Configure OAuth credentials\n\n" +
            "Once configured, OAuth will work automatically.",
          [{ text: "OK" }]
        );
      }
    } catch (err) {
      console.error("OAuth error:", err);
      setError("OAuth login failed. Please try again.");
    } finally {
      setOauthLoading(false);
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
          <View className="items-center gap-3" style={{ marginBottom: 40 }}>
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
              Your spiritual companion for Hindu practices
            </Text>
          </View>

          {/* Login Card */}
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
                  placeholder="Enter your password"
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

              {/* Bypass Button */}
              <TouchableOpacity
                onPress={() => router.replace("/(tabs)")}
                className="items-center justify-center"
                style={{
                  backgroundColor: COLOR.terracottaLight,
                  paddingVertical: 16,
                  borderRadius: 14,
                  marginTop: 8,
                }}
              >
                <Text variant="small" className="font-semibold" style={{ color: COLOR.white }}>
                  Bypass
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
                className="items-center justify-center"
                style={{
                  backgroundColor: isLoading ? COLOR.terracottaLight : COLOR.terracotta,
                  paddingVertical: 16,
                  borderRadius: 14,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLOR.white} />
                ) : (
                  <Text variant="small" className="font-bold" style={{ color: COLOR.white }}>
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-2">
                <View className="flex-1 h-px" style={{ backgroundColor: COLOR.creamDark }} />
                <Text variant="muted" className="mx-4" style={{ color: COLOR.inkLight }}>
                  or continue with
                </Text>
                <View className="flex-1 h-px" style={{ backgroundColor: COLOR.creamDark }} />
              </View>

              {/* OAuth Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => handleOAuth("google")}
                  disabled={oauthLoading}
                  activeOpacity={0.85}
                  className="flex-1 flex-row items-center justify-center gap-2"
                  style={{
                    backgroundColor: COLOR.cream,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: COLOR.creamDark,
                  }}
                >
                  {oauthLoading ? (
                    <ActivityIndicator color={COLOR.ink} size="small" />
                  ) : (
                    <>
                      <Ionicons name="logo-google" size={18} color="#DB4437" />
                      <Text variant="small" className="font-semibold" style={{ color: COLOR.ink }}>
                        Google
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOAuth("apple")}
                  disabled={oauthLoading}
                  activeOpacity={0.85}
                  className="flex-1 flex-row items-center justify-center gap-2"
                  style={{
                    backgroundColor: COLOR.cream,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: COLOR.creamDark,
                  }}
                >
                  {oauthLoading ? (
                    <ActivityIndicator color={COLOR.ink} size="small" />
                  ) : (
                    <>
                      <Ionicons name="logo-apple" size={18} color={COLOR.ink} />
                      <Text variant="small" className="font-semibold" style={{ color: COLOR.ink }}>
                        Apple
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center mt-6">
            <Text variant="muted" style={{ color: COLOR.inkMuted }}>
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text variant="small" className="font-bold" style={{ color: COLOR.terracotta }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}