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
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/contexts";

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
                    <View className="items-center mb-10">
                        <Text className="text-4xl font-bold text-orange-500 mb-2">
                            🙏 DigiPandit
                        </Text>
                        <Text className="text-gray-400 text-center">
                            Create your spiritual account
                        </Text>
                    </View>

                    {/* Sign Up Form */}
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
                                placeholder="Create a password (min 8 chars)"
                                placeholderTextColor="#6B7280"
                                secureTextEntry
                                className="bg-gray-800 text-white px-4 py-4 rounded-xl border border-gray-700 text-base"
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="text-gray-300 mb-2 font-medium">
                                Confirm Password
                            </Text>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm your password"
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

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            disabled={isLoading}
                            className={`mt-6 py-4 rounded-xl ${isLoading ? "bg-orange-700" : "bg-orange-500"
                                }`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-bold text-lg">
                                    Create Account
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Terms */}
                        <Text className="text-gray-500 text-center text-sm mt-4">
                            By signing up, you agree to our Terms of Service and Privacy
                            Policy
                        </Text>

                        {/* Sign In Link */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-gray-400">Already have an account? </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-orange-500 font-bold">Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
