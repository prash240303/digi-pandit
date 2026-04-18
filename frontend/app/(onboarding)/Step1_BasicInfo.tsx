// app/(onboarding)/Step1_BasicInfo.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../contexts/onboarding-context';
import ProgressDots from '../../components/ProgressDots';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, Calendar, ArrowRight } from 'lucide-react-native';

export default function Step1() {
  const router = useRouter();
  const { setData } = useOnboarding();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  const getZodiac = (dob: string) => {
    if (!dob || dob.length < 10) return null;
    const date = new Date(dob);
    if (isNaN(date.getTime())) return null;
    const m = date.getMonth() + 1, d = date.getDate();
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'Aries';
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'Taurus';
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'Gemini';
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'Cancer';
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'Leo';
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'Virgo';
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'Libra';
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'Scorpio';
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'Sagittarius';
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'Capricorn';
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'Aquarius';
    return 'Pisces';
  };

  const handleNext = () => {
    if (!fullName) return; // Simple validation
    const zodiac_sign = dob ? getZodiac(dob) : undefined;
    setData({ full_name: fullName, phone, date_of_birth: dob, zodiac_sign: zodiac_sign || undefined });
    router.push('/(onboarding)/Step2_Preferences');
  };

  const zodiac = getZodiac(dob);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <LinearGradient
          colors={['rgba(124, 58, 237, 0.1)', 'transparent']}
          style={styles.gradient}
        />
        
        <View style={styles.content}>
          <ProgressDots current={1} total={3} />
          
          <Text style={styles.title}>Welcome to Digi Pandit</Text>
          <Text style={styles.subtitle}>Let\'s start by getting to know you better</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color="#666" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={fullName} 
                  onChangeText={setFullName}
                  placeholder="e.g. Rahul Sharma" 
                  placeholderTextColor="#444" 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <View style={styles.inputWrapper}>
                <Phone size={18} color="#666" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={phone} 
                  onChangeText={setPhone}
                  placeholder="+91 98765 43210" 
                  placeholderTextColor="#444" 
                  keyboardType="phone-pad" 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <View style={styles.inputWrapper}>
                <Calendar size={18} color="#666" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  value={dob} 
                  onChangeText={setDob}
                  placeholder="YYYY-MM-DD" 
                  placeholderTextColor="#444" 
                />
              </View>
              {zodiac && (
                <View style={styles.zodiacBadge}>
                  <Text style={styles.zodiacText}>✨ {zodiac} Season</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.btn, !fullName && styles.btnDisabled]} 
              onPress={handleNext}
              disabled={!fullName}
            >
              <Text style={styles.btnText}>Continue</Text>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#050505' },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  content: { flex: 1, padding: 24, paddingTop: 80 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 12, lineHeight: 38 },
  subtitle: { color: '#999', marginBottom: 40, fontSize: 16, lineHeight: 24 },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { color: '#ccc', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 16,
    height: 60,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', fontSize: 16, height: '100%' },
  zodiacBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  zodiacText: { color: '#A78BFA', fontSize: 13, fontWeight: '600' },
  footer: { marginTop: 'auto', paddingTop: 40, paddingBottom: 20 },
  btn: { 
    backgroundColor: '#7C3AED', 
    borderRadius: 16, 
    height: 60, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btnDisabled: { backgroundColor: '#333', shadowOpacity: 0 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});