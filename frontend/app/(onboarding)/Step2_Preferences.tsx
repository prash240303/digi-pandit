// app/(onboarding)/Step2_Preferences.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../contexts/onboarding-context';
import ProgressDots from '../../components/ProgressDots';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Globe, MapPin } from 'lucide-react-native';

const REGIONS = ['North India', 'South India', 'East India', 'West India', 'International'];
const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Marathi', value: 'mr' },
];

export default function Step2() {
  const router = useRouter();
  const { data, setData } = useOnboarding();
  const [region, setRegion] = useState(data.region || '');
  const [language, setLanguage] = useState(data.language || 'en');

  const handleNext = () => {
    setData({ region, language });
    router.push('/(onboarding)/Step3_Notifications');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <LinearGradient
        colors={['rgba(124, 58, 237, 0.05)', 'transparent']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <ProgressDots current={2} total={3} />
        
        <Text style={styles.title}>Your Preferences</Text>
        <Text style={styles.subtitle}>Help us tailor your spiritual experience</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={18} color="#7C3AED" />
            <Text style={styles.label}>Select Region</Text>
          </View>
          <View style={styles.chips}>
            {REGIONS.map(r => (
              <TouchableOpacity 
                key={r} 
                style={[styles.chip, region === r && styles.chipActive]}
                onPress={() => setRegion(r)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, region === r && styles.chipTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={18} color="#7C3AED" />
            <Text style={styles.label}>Preferred Language</Text>
          </View>
          <View style={styles.chips}>
            {LANGUAGES.map(l => (
              <TouchableOpacity 
                key={l.value} 
                style={[styles.chip, language === l.value && styles.chipActive]}
                onPress={() => setLanguage(l.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, language === l.value && styles.chipTextActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.btn, (!region || !language) && styles.btnDisabled]} 
            onPress={handleNext}
            disabled={!region || !language}
          >
            <Text style={styles.btnText}>Continue</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#050505' },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  content: { flex: 1, padding: 24, paddingTop: 80 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 12 },
  subtitle: { color: '#999', marginBottom: 40, fontSize: 16 },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  label: { color: '#ccc', fontSize: 15, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { 
    backgroundColor: '#111', 
    borderWidth: 1, 
    borderColor: '#222', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12 
  },
  chipActive: { 
    backgroundColor: 'rgba(124, 58, 237, 0.15)', 
    borderColor: '#7C3AED' 
  },
  chipText: { color: '#888', fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
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