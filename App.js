import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';

import TopBar from './src/components/TopBar';
import FloatingTabBar from './src/components/FloatingTabBar';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import PostScreen from './src/screens/PostScreen';
import ChatsScreen from './src/screens/ChatsScreen';
import ChatScreen from './src/screens/ChatScreen';
import LiveChatScreen from './src/screens/LiveChatScreen';
import DebateDetailScreen from './src/screens/DebateDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import JoinDebateScreen from './src/screens/JoinDebateScreen';
import { StoreProvider } from './src/store/AppStore';
import { C } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: C.bg } };

const Tabs = () => (
  <Tab.Navigator tabBar={(p) => <FloatingTabBar {...p} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Post" component={PostScreen} />
    <Tab.Screen name="Chats" component={ChatsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const headerStyle = {
  header: (props) => <TopBar {...props} />,
};

export default function App() {
  // app is portrait-only; the live debate screen unlocks landscape for full screen
  React.useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={headerStyle}>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="DebateDetail" component={DebateDetailScreen} options={{ title: 'DEBATE' }} />
            <Stack.Screen name="LiveChat" component={LiveChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="UserProfile" component={ProfileScreen} options={{ title: 'PROFILE' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'NOTIFICATIONS' }} />
            <Stack.Screen name="JoinDebate" component={JoinDebateScreen} options={{ title: 'JOIN DEBATE' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
