// app/(onboarding)/Step3_Notifications.tsx
import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useOnboarding } from '../../contexts/onboarding-context';
import { useAuth } from '../../contexts/auth-context';
import { updateProfile } from '../../services/profileService';
import ProgressDots from '../../components/ProgressDots';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Sparkles, Music, Check } from 'lucide-react-native';


export default function Step3() {
  const { data } = useOnboarding();
  const { user, refreshProfile } = useAuth();
  const [notifyFestival, setNotifyFestival] = useState(true);
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const finalData = { 
        ...data, 
        notify_festival: notifyFestival, 
        notify_daily: notifyDaily 
      };
      await updateProfile(user.id, { ...finalData, onboarding_complete: true });
      await refreshProfile(); // This should trigger the AuthGate to move to (tabs)
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <LinearGradient
        colors={['rgba(124, 58, 237, 0.05)', 'transparent']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <ProgressDots current={3} total={3} />
        
        <Text style={styles.title}>Stay Updated</Text>
        <Text style={styles.subtitle}>Choose how you\'d like to stay connected with your spiritual path</Text>

        <View style={styles.cardContainer}>
          <View style={styles.notificationCard}>
            <View style={styles.iconCircle}>
              <Sparkles size={20} color="#7C3AED" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Festival Alerts</Text>
              <Text style={styles.cardDesc}>Get notified about upcoming festivals and auspicious timings.</Text>
            </View>
            <Switch 
              value={notifyFestival} 
              onValueChange={setNotifyFestival}
              trackColor={{ false: '#333', true: '#7C3AED' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#fff'}
            />
          </View>

          <View style={styles.notificationCard}>
            <View style={styles.iconCircle}>
              <Music size={20} color="#7C3AED" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Daily Spiritual Dose</Text>
              <Text style={styles.cardDesc}>Curated mantras and daily panchangam updates every morning.</Text>
            </View>
            <Switch 
              value={notifyDaily} 
              onValueChange={setNotifyDaily}
              trackColor={{ false: '#333', true: '#7C3AED' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#fff'}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Bell size={16} color="#666" />
          <Text style={styles.infoText}>You can change these settings anytime in your profile.</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.btn, loading && styles.btnDisabled]} 
            onPress={handleFinish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.btnText}>Complete Setup</Text>
                <Check size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Re-using styles for consistency
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#050505' },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  content: { flex: 1, padding: 24, paddingTop: 80 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 12 },
  subtitle: { color: '#999', marginBottom: 40, fontSize: 16 },
  cardContainer: { gap: 16, marginBottom: 32 },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardBody: { flex: 1, marginRight: 8 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 4 },
  cardDesc: { color: '#666', fontSize: 13, lineHeight: 18 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  infoText: { color: '#666', fontSize: 13 },
  footer: { marginTop: 'auto', paddingTop: 40, paddingBottom: 20 },
  btn: { 
    backgroundColor: '#7C3AED', 
    borderRadius: 16, 
    height: 60, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8,
  },
  btnDisabled: { backgroundColor: '#333' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});