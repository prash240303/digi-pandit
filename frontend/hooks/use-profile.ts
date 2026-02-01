import { useCallback, useState } from "react";
import { useAuth } from "@/contexts";
import { UpdateProfileData } from "@/services/auth";

// Hook for profile management
export function useProfile() {
    const { user, updateProfile, refreshUser, isLoading } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = useCallback(async (data: UpdateProfileData) => {
        setIsUpdating(true);
        setError(null);

        const result = await updateProfile(data);

        setIsUpdating(false);

        if (!result.success) {
            setError(result.error || "Update failed");
        }

        return result;
    }, [updateProfile]);

    const refresh = useCallback(async () => {
        await refreshUser();
    }, [refreshUser]);

    return {
        user,
        isLoading: isLoading || isUpdating,
        error,
        update,
        refresh,
        clearError: () => setError(null),
    };
}
