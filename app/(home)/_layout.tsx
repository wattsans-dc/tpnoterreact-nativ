import { ClerkLoaded } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <ClerkLoaded>
      <Slot />
    </ClerkLoaded>
  );
}
