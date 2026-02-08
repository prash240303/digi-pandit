import React, { useState } from "react";
import {
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
import { Box } from "@/components/ui/box";
import { Text as GText } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { COLOR } from "@/constants/colors";

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

// Shared input style for consistency
const inputStyle = {
  backgroundColor: COLOR.cream,
  color: COLOR.ink,
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: COLOR.creamDark,
  fontSize: 16,
  outlineWidth: 0, // Remove focus outline on web
} as const;

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

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

      // Create a redirect URL that Expo can handle
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "digipandit",
        path: "(auth)/callback",
      });

      console.log("OAuth redirect URL:", redirectUrl);

      // Get OAuth URL from backend
      const response = await authService.getOAuthUrl(provider, redirectUrl);

      console.log("OAuth response:", JSON.stringify(response, null, 2));

      if (response.success && response.data?.url) {
        const oauthUrl = response.data.url;
        console.log("Opening OAuth URL:", oauthUrl);

        // Validate URL before opening
        if (
          !oauthUrl ||
          typeof oauthUrl !== "string" ||
          !oauthUrl.startsWith("http")
        ) {
          setError("Invalid OAuth URL received from server");
          return;
        }

        // Open the OAuth URL in a browser
        const result = await WebBrowser.openAuthSessionAsync(
          oauthUrl,
          redirectUrl,
        );

        console.log("OAuth result:", result);

        if (result.type === "success" && result.url) {
          // Parse the callback URL for tokens
          const url = new URL(result.url);
          const accessToken =
            url.searchParams.get("access_token") ||
            url.hash?.match(/access_token=([^&]+)/)?.[1];

          if (accessToken) {
            // Verify the token with our backend
            const verifyResponse = await fetch(
              `${API_BASE_URL}/api/v1/auth/oauth/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ access_token: accessToken }),
              },
            );
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Login successful, navigate to main app
              router.replace("/(tabs)");
              return;
            }
          }

          setError("Failed to complete authentication");
        } else if (result.type === "cancel") {
          // User cancelled, no error needed
          console.log("OAuth cancelled by user");
        } else {
          setError("Authentication was cancelled or failed");
        }
      } else {
        // Show setup required message if backend doesn't have OAuth configured
        Alert.alert(
          "OAuth Setup Required",
          `To use ${provider === "google" ? "Google" : "Apple"} login:\n\n` +
            "1. Go to Supabase Dashboard → Authentication → Providers\n" +
            `2. Enable ${provider === "google" ? "Google" : "Apple"} provider\n` +
            "3. Configure OAuth credentials\n\n" +
            "Once configured, OAuth will work automatically.",
          [{ text: "OK" }],
        );
      }
    } catch (err) {
      console.error("OAuth error:", err);
      setError("OAuth login failed. Please try again.");
    } finally {
      setOauthLoading(false);
    }
  };

  const testing = async () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.cream }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
          <VStack className="items-center gap-3" style={{ marginBottom: 40 }}>
            {/* Logo circle */}
            <Box
              className="rounded-full items-center justify-center"
              style={{
                width: 80,
                height: 80,
                backgroundColor: COLOR.terracotta + "15",
                borderWidth: 2,
                borderColor: COLOR.terracotta + "30",
              }}
            >
              <GText style={{ fontSize: 40 }}>🙏</GText>
            </Box>
            <Heading
              size="2xl"
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
            </Heading>
            <GText
              size="sm"
              style={{ color: COLOR.inkMuted, textAlign: "center" }}
            >
              Your spiritual companion for Hindu practices
            </GText>
          </VStack>

          {/* Login Card */}
          <Box
            className="rounded-3xl"
            style={{
              backgroundColor: COLOR.cardBg,
              borderWidth: 1,
              borderColor: COLOR.creamDark,
              padding: 24,
            }}
          >
            <VStack style={{ gap: 16 }}>
              {/* Email Field */}
              <VStack style={{ gap: 6 }}>
                <GText
                  size="sm"
                  style={{ color: COLOR.ink, fontWeight: "600" }}
                >
                  Email
                </GText>
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
              </VStack>

              {/* Password Field */}
              <VStack style={{ gap: 6 }}>
                <GText
                  size="sm"
                  style={{ color: COLOR.ink, fontWeight: "600" }}
                >
                  Password
                </GText>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={COLOR.inkLight}
                  secureTextEntry
                  style={inputStyle}
                />
              </VStack>

              {/* Error Message */}
              {error ? (
                <Box
                  className="rounded-xl"
                  style={{
                    backgroundColor: "#FEE2E2",
                    borderWidth: 1,
                    borderColor: "#FECACA",
                    padding: 12,
                  }}
                >
                  <GText
                    size="sm"
                    style={{ color: "#DC2626", textAlign: "center" }}
                  >
                    {error}
                  </GText>
                </Box>
              ) : null}

              <TouchableOpacity
                style={{
                  backgroundColor: isLoading
                    ? COLOR.terracottaLight
                    : COLOR.terracotta,
                  paddingVertical: 16,
                  borderRadius: 14,
                  marginTop: 8,
                }}
                onPress={testing}
              >
                bypass
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
                style={{
                  backgroundColor: isLoading
                    ? COLOR.terracottaLight
                    : COLOR.terracotta,
                  paddingVertical: 16,
                  borderRadius: 14,
                  marginTop: 8,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLOR.white} />
                ) : (
                  <GText
                    size="md"
                    style={{
                      color: COLOR.white,
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    Sign In
                  </GText>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <HStack className="items-center" style={{ marginVertical: 8 }}>
                <Box
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: COLOR.creamDark,
                  }}
                />
                <GText
                  size="xs"
                  style={{ color: COLOR.inkLight, marginHorizontal: 16 }}
                >
                  or continue with
                </GText>
                <Box
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: COLOR.creamDark,
                  }}
                />
              </HStack>

              {/* OAuth Buttons */}
              <HStack style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={() => handleOAuth("google")}
                  disabled={oauthLoading}
                  activeOpacity={0.85}
                  style={{
                    flex: 1,
                    backgroundColor: COLOR.cream,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: COLOR.creamDark,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {oauthLoading ? (
                    <ActivityIndicator color={COLOR.ink} size="small" />
                  ) : (
                    <>
                      <Ionicons name="logo-google" size={18} color="#DB4437" />
                      <GText
                        size="sm"
                        style={{ color: COLOR.ink, fontWeight: "600" }}
                      >
                        Google
                      </GText>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleOAuth("apple")}
                  disabled={oauthLoading}
                  activeOpacity={0.85}
                  style={{
                    flex: 1,
                    backgroundColor: COLOR.cream,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: COLOR.creamDark,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {oauthLoading ? (
                    <ActivityIndicator color={COLOR.ink} size="small" />
                  ) : (
                    <>
                      <Ionicons name="logo-apple" size={18} color={COLOR.ink} />
                      <GText
                        size="sm"
                        style={{ color: COLOR.ink, fontWeight: "600" }}
                      >
                        Apple
                      </GText>
                    </>
                  )}
                </TouchableOpacity>
              </HStack>
            </VStack>
          </Box>

          {/* Sign Up Link */}
          <HStack
            className="items-center justify-center"
            style={{ marginTop: 24 }}
          >
            <GText size="sm" style={{ color: COLOR.inkMuted }}>
              Don't have an account?{" "}
            </GText>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <GText
                  size="sm"
                  style={{ color: COLOR.terracotta, fontWeight: "700" }}
                >
                  Sign Up
                </GText>
              </TouchableOpacity>
            </Link>
          </HStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
