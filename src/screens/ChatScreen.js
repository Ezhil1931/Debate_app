import React from 'react';
import ChatView from '../components/ChatView';
import { users } from '../data';

export default function ChatScreen({ route, navigation }) {
  const u = users[route.params.id];
  React.useLayoutEffect(() => navigation.setOptions({ title: u.name }), [navigation, u]);
  return (
    <ChatView
      initial={[
        { id: '1', user: u.name, text: 'Hey! Ready to debate?' },
        { id: '2', user: 'You', text: 'Always. Bring your best points.', mine: true },
        { id: '3', user: u.name, text: 'Challenge accepted.' },
      ]}
    />
  );
}
