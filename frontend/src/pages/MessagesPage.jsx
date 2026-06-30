import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const { user } = useAuth();
  const { userId: routeUserId } = useParams();
  const [activeConvo, setActiveConvo] = useState(routeUserId || null);
  const [newMsg, setNewMsg] = useState('');
  const [newConvoEmail, setNewConvoEmail] = useState('');
  const msgEndRef = useRef(null);
  const qc = useQueryClient();

  const { data: conversations, isLoading: convLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesAPI.getConversations().then(r => r.data.data),
    refetchInterval: 10000,
  });

  const { data: messages, isLoading: msgLoading } = useQuery({
    queryKey: ['messages', activeConvo],
    queryFn: () => messagesAPI.getWithUser(activeConvo).then(r => r.data.data),
    enabled: !!activeConvo,
    refetchInterval: 5000,
  });

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMut = useMutation({
    mutationFn: (data) => messagesAPI.send(data),
    onSuccess: () => {
      setNewMsg('');
      qc.invalidateQueries(['messages', activeConvo]);
      qc.invalidateQueries(['conversations']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send'),
  });

  const handleSend = () => {
    if (!newMsg.trim() || !activeConvo) return;
    sendMut.mutate({ receiverId: activeConvo, content: newMsg.trim() });
  };

  const activePartner = conversations?.find(c => c.partner?.id === activeConvo)?.partner;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Messages</h1>
          <p>Chat with your university network</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, height: 'calc(100vh - 220px)' }}>
        {/* Conversations List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Conversations</div>
          {convLoading ? (
            <div className="flex-center" style={{ flex: 1 }}><div className="spinner" /></div>
          ) : conversations?.length ? (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {conversations.map(c => (
                <div
                  key={c.partner?.id}
                  onClick={() => setActiveConvo(c.partner?.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    cursor: 'pointer', background: activeConvo === c.partner?.id ? 'var(--primary-glow)' : 'transparent',
                    borderLeft: activeConvo === c.partner?.id ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div className="avatar avatar-sm">{c.partner?.name?.[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.partner?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.lastMessage?.content || 'No messages yet'}
                    </div>
                  </div>
                  {c.unreadCount > 0 && (
                    <span style={{ background: 'var(--primary)', color: 'white', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700, padding: '2px 7px', flexShrink: 0 }}>
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 24, flex: 1 }}>
              <div className="empty-state-icon">◌</div>
              <p>No conversations yet</p>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeConvo ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar avatar-sm">{activePartner?.name?.[0] || '?'}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{activePartner?.name || 'User'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active now</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {msgLoading ? (
                  <div className="flex-center" style={{ flex: 1 }}><div className="spinner" /></div>
                ) : messages?.length ? messages.map(msg => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%',
                        padding: '10px 16px',
                        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMe ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: isMe ? 'white' : 'var(--text-primary)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}>
                        {msg.content}
                        <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">💬</div>
                    <p>Start the conversation!</p>
                  </div>
                )}
                <div ref={msgEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 8 }}>
                <input
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Type a message…"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                />
                <button className="btn btn-primary" onClick={handleSend} disabled={!newMsg.trim() || sendMut.isPending}>
                  Send →
                </button>
              </div>
            </>
          ) : (
            <div className="flex-center" style={{ flex: 1, flexDirection: 'column', gap: 12, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem' }}>◌</div>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
