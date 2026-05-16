import { Redirect } from 'expo-router';

export default function Index() {
  // Bypassed login to show catalog immediately
  return <Redirect href="/(customer)" />;
}
