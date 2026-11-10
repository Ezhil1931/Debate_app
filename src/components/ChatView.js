import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Btn } from './UI';
import { C, border, font } from '../theme';

// msgs/setMsgs are optional: pass them to share the message list with a parent
export default function ChatView({ initial, header, msgs: extMsgs, setMsgs: extSet }) {
  const [ownMsgs, setOwnMsgs] = useState(initial);
  const msgs = extMsgs ?? ownMsgs;
  const setMsgs = extSet ?? setOwnMsgs;
  const [text, setText] = useState('');
  const ref = useRef(null);
  const { bottom } = useSafeAreaInsets();

  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { id: String(Date.now()), user: 'You', text: text.trim(), mine: true }]);
    setText('');
    setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {header}
      <FlatList
        ref={ref}
        data={msgs}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.mine ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              marginBottom: 10,
              backgroundColor: item.mine ? C.ink : C.accent,
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 9,
            }}
          >
            {!item.mine && <Text style={[font, { fontSize: 11, marginBottom: 2, color: C.muted }]}>{item.user}</Text>}
            <Text style={{ fontWeight: '500', color: item.mine ? '#fff' : C.ink }}>{item.text}</Text>
          </View>
        )}
      />
      <View
        style={{
          flexDirection: 'row', gap: 8, padding: 12, paddingBottom: bottom + 12,
          borderTopWidth: 1, borderColor: C.line, backgroundColor: C.card,
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message..."
          placeholderTextColor={C.muted}
          onSubmitEditing={send}
          style={{ flex: 1, ...border, backgroundColor: C.card, paddingHorizontal: 14, fontWeight: '500' }}
        />
        <Btn label="Send" onPress={send} />
      </View>
    </KeyboardAvoidingView>
  );
}
