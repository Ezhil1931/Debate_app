import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Screen from '../components/Screen';
import { Btn, Title, Card } from '../components/UI';
import { border, font, C } from '../theme';

const Field = ({ label, ...props }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={[font, { fontSize: 13, marginBottom: 4 }]}>{label}</Text>
    <TextInput
      placeholderTextColor="#777"
      {...props}
      style={{ ...border, backgroundColor: C.card, padding: 10, fontWeight: '500', textAlignVertical: 'top', ...(props.multiline ? { minHeight: 90 } : null) }}
    />
  </View>
);

export default function PostScreen() {
  const [mode, setMode] = useState('POST');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [opp, setOpp] = useState('');
  const [time, setTime] = useState('');
  const [done, setDone] = useState(false);

  const submit = () => {
    setDone(true);
    setText(''); setTitle(''); setAbout(''); setOpp(''); setTime('');
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <Screen>
      <Title>Create</Title>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        {['POST', 'DEBATE'].map((m) => (
          <Btn key={m} label={m} color={mode === m ? C.ink : C.accent} onPress={() => setMode(m)} style={{ flex: 1 }} />
        ))}
      </View>
      {mode === 'POST' ? (
        <Field label="WHAT'S YOUR TAKE?" value={text} onChangeText={setText} multiline placeholder="Write something bold..." />
      ) : (
        <>
          <Field label="DEBATE TITLE" value={title} onChangeText={setTitle} placeholder="E.G. CATS > DOGS" />
          <Field label="ABOUT THE DEBATE" value={about} onChangeText={setAbout} multiline placeholder="What is it about?" />
          <Field label="OPPONENT" value={opp} onChangeText={setOpp} placeholder="@username" />
          <Field label="DATE & TIME" value={time} onChangeText={setTime} placeholder="FRI 9:00 PM" />
        </>
      )}
      <Btn label={mode === 'POST' ? 'PUBLISH POST' : 'SCHEDULE DEBATE'} onPress={submit} color={C.blue} style={{ marginTop: 6 }} />
      {done && (
        <Card color={C.accent} style={{ marginTop: 20 }}>
          <Text style={[font, { fontSize: 16 }]}>DONE! (demo only, not saved)</Text>
        </Card>
      )}
    </Screen>
  );
}
