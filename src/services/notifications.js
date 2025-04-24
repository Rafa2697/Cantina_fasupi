import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { db } from '../firebase/config';
import { setDoc, doc } from 'firebase/firestore';

export async function registerForPushNotificationsAsync(userId) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  // Salva o token no Firestore
  await setDoc(doc(db, 'tokens', userId), { token }, { merge: true });

  // Android config (opcional)
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}
