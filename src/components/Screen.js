import React from 'react';
import { ScrollView } from 'react-native';
import { BlurTargetView } from 'expo-blur';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBlurRef } from '../blurTargets';
import { C } from '../theme';

export default function Screen({ children, pad = 110, ...rest }) {
  const { top } = useSafeAreaInsets();
  const route = useRoute();
  return (
    <BlurTargetView ref={getBlurRef(route.name)} style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: C.bg }}
        contentContainerStyle={{ padding: 16, paddingTop: top + 16, paddingBottom: pad }}
        keyboardShouldPersistTaps="handled"
        {...rest}
      >
        {children}
      </ScrollView>
    </BlurTargetView>
  );
}
