import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { debates as scheduledDebates, openDebates } from '../data';

// Frontend-only app state: debates, community nominations, stars and the
// notifications the logged-in user receives when they are mentioned.
const StoreContext = createContext(null);

const starsOf = (n) => (n.baseStars ?? 0) + (n.boosters?.length ?? 0);

const cloneOpenDebates = () =>
  openDebates.map((d) => ({
    ...d,
    nominations: d.nominations.map((n) => ({ ...n, boosters: [...(n.boosters ?? [])] })),
  }));

// seed one notification for every open debate where "me" is nominated
const seedNotifications = () =>
  openDebates.flatMap((d) =>
    d.nominations
      .filter((n) => n.userId === 'me')
      .map((n) => ({ id: `n-${d.id}`, debateId: d.id, by: n.nominatedBy, read: false }))
  );

export function StoreProvider({ children }) {
  const [debates, setDebates] = useState(() => [
    ...scheduledDebates.map((d) => ({ ...d, open: false, nominations: [] })),
    ...cloneOpenDebates(),
  ]);
  const [notifications, setNotifications] = useState(seedNotifications);

  const getDebate = useCallback((id) => debates.find((d) => d.id === id), [debates]);

  // nominations sorted by support, with the current leader flagged
  const nomineesFor = useCallback((debateId) => {
    const d = debates.find((x) => x.id === debateId);
    const rows = (d?.nominations ?? [])
      .map((n) => ({
        ...n,
        stars: starsOf(n),
        starredByMe: (n.boosters ?? []).includes('me'),
      }))
      .sort((a, b) => b.stars - a.stars);
    return rows.map((n, i) => ({ ...n, leading: i === 0 && n.stars > 0 }));
  }, [debates]);

  const toggleStar = useCallback((debateId, userId) => {
    setDebates((list) =>
      list.map((d) => {
        if (d.id !== debateId) return d;
        return {
          ...d,
          nominations: d.nominations.map((n) => {
            if (n.userId !== userId) return n;
            const boosters = n.boosters ?? [];
            return {
              ...n,
              boosters: boosters.includes('me')
                ? boosters.filter((b) => b !== 'me')
                : [...boosters, 'me'],
            };
          }),
        };
      })
    );
  }, []);

  // mention someone new for the opposite side (or back them if already in)
  const nominate = useCallback((debateId, userId) => {
    setDebates((list) =>
      list.map((d) => {
        if (d.id !== debateId) return d;
        if (d.nominations.some((n) => n.userId === userId)) {
          return {
            ...d,
            nominations: d.nominations.map((n) => {
              if (n.userId !== userId) return n;
              const boosters = n.boosters ?? [];
              return boosters.includes('me')
                ? n
                : { ...n, boosters: [...boosters, 'me'] };
            }),
          };
        }
        return {
          ...d,
          nominations: [
            ...d.nominations,
            { userId, baseStars: 0, boosters: ['me'], nominatedBy: 'me' },
          ],
        };
      })
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((ns) => (ns.some((n) => !n.read) ? ns.map((n) => ({ ...n, read: true })) : ns));
  }, []);

  const joinDebate = useCallback((debateId, time) => {
    setDebates((list) => list.map((d) => (d.id === debateId ? { ...d, b: 'me', time } : d)));
    setNotifications((ns) => ns.map((n) => (n.debateId === debateId ? { ...n, read: true } : n)));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({
      debates,
      notifications,
      unreadCount,
      getDebate,
      nomineesFor,
      toggleStar,
      nominate,
      markAllRead,
      joinDebate,
    }),
    [debates, notifications, unreadCount, getDebate, nomineesFor, toggleStar, nominate, markAllRead, joinDebate]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
