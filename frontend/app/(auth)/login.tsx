import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/contexts";
import { API_BASE_URL } from "@/services/api";

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

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

            // For now, show a message that OAuth needs to be configured
            Alert.alert(
                "OAuth Setup Required",
                `To use ${provider === "google" ? "Google" : "Apple"} login:\n\n` +
                "1. Go to Supabase Dashboard → Authentication → Providers\n" +
                `2. Enable ${provider === "google" ? "Google" : "Apple"} provider\n` +
                "3. Configure OAuth credentials\n\n" +
                "Once configured, OAuth will work automatically.",
                [{ text: "OK" }]
            );

            // Uncomment below once OAuth is configured in Supabase:
            /*
            const redirectUrl = Linking.createURL("/(auth)/callback");
            const response = await fetch(
                `${API_BASE_URL}/api/v1/auth/oauth?provider=${provider}&redirect_url=${encodeURIComponent(redirectUrl)}`
            );
            const data = await response.json();
            
            if (data.success && data.data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(
                    data.data.url,
                    redirectUrl
                );
                
                if (result.type === "success") {
                    // Handle successful OAuth - extract token from URL
                    // and call your auth context to set the user
                }
            }
            */
        } catch (err) {
            console.error("OAuth error:", err);
            setError("OAuth login failed");
        } finally {
            setOauthLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-gray-900"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-6 py-12">
                    {/* Header */}
                    <View className="items-center mb-12">
                        <Text className="text-4xl font-bold text-orange-500 mb-2">
                            🙏 DigiPandit
                        </Text>
                        <Text className="text-gray-400 text-center">
                            Your spiritual companion for Hindu practices
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-300 mb-2 font-medium">Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor="#6B7280"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="bg-gray-800 text-white px-4 py-4 rounded-xl border border-gray-700 text-base"
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="text-gray-300 mb-2 font-medium">Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                placeholderTextColor="#6B7280"
                                secureTextEntry
                                className="bg-gray-800 text-white px-4 py-4 rounded-xl border border-gray-700 text-base"
                            />
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <View className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mt-4">
                                <Text className="text-red-400 text-center">{error}</Text>
                            </View>
                        ) : null}

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            className={`mt-6 py-4 rounded-xl ${isLoading ? "bg-orange-700" : "bg-orange-500"
                                }`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-bold text-lg">
                                    Sign In
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-px bg-gray-700" />
                            <Text className="text-gray-500 mx-4">or continue with</Text>
                            <View className="flex-1 h-px bg-gray-700" />
                        </View>

                        {/* OAuth Buttons */}
                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => handleOAuth("google")}
                                disabled={oauthLoading}
                                className="flex-1 bg-gray-800 py-4 rounded-xl border border-gray-700"
                            >
                                {oauthLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text className="text-white text-center font-medium">
                                        🔵 Google
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleOAuth("apple")}
                                disabled={oauthLoading}
                                className="flex-1 bg-gray-800 py-4 rounded-xl border border-gray-700"
                            >
                                {oauthLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text className="text-white text-center font-medium">
                                        ⚫ Apple
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Link */}
                        <View className="flex-row justify-center mt-8">
                            <Text className="text-gray-400">Don't have an account? </Text>
                            <Link href="/(auth)/signup" asChild>
                                <TouchableOpacity>
                                    <Text className="text-orange-500 font-bold">Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
