import React, { useState } from "react";
import {
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts";
import { Box } from "@/components/ui/box";
import { Text as GText } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { COLOR } from "@/constants/colors";

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

export default function SignUpScreen() {
    const { signUp, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        setError("");

        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }
        if (!password) {
            setError("Please enter a password");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const result = await signUp({ email: email.trim(), password });

        if (result.success) {
            router.replace("/(tabs)");
        } else {
            setError(result.error || "Sign up failed");
        }
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
                    <VStack className="items-center gap-3" style={{ marginBottom: 32 }}>
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
                            Create your spiritual account
                        </GText>
                    </VStack>

                    {/* Sign Up Card */}
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
                                    placeholder="Create a password (min 8 chars)"
                                    placeholderTextColor={COLOR.inkLight}
                                    secureTextEntry
                                    style={inputStyle}
                                />
                            </VStack>

                            {/* Confirm Password Field */}
                            <VStack style={{ gap: 6 }}>
                                <GText
                                    size="sm"
                                    style={{ color: COLOR.ink, fontWeight: "600" }}
                                >
                                    Confirm Password
                                </GText>
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirm your password"
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

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                onPress={handleSignUp}
                                disabled={isLoading}
                                activeOpacity={0.85}
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
                                    <GText
                                        size="md"
                                        style={{
                                            color: COLOR.white,
                                            textAlign: "center",
                                            fontWeight: "700",
                                        }}
                                    >
                                        Create Account
                                    </GText>
                                )}
                            </TouchableOpacity>

                            {/* Terms */}
                            <GText
                                size="xs"
                                style={{
                                    color: COLOR.inkLight,
                                    textAlign: "center",
                                    lineHeight: 18,
                                    marginTop: 4,
                                }}
                            >
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </GText>
                        </VStack>
                    </Box>

                    {/* Sign In Link */}
                    <HStack
                        className="items-center justify-center"
                        style={{ marginTop: 24 }}
                    >
                        <GText size="sm" style={{ color: COLOR.inkMuted }}>
                            Already have an account?{" "}
                        </GText>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <GText
                                    size="sm"
                                    style={{ color: COLOR.terracotta, fontWeight: "700" }}
                                >
                                    Sign In
                                </GText>
                            </TouchableOpacity>
                        </Link>
                    </HStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
