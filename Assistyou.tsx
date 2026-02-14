"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function AssistYou() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', text: '[SYSTEM_BOOT]: Mobile Unit 01 Online. Ready for command.' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });
            const data = await res.json();
            if (data.text) {
                setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: '[ERR]: Neural Link Failure.' }]);
        }
        setLoading(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000, fontFamily: 'monospace' }}>

            {/* ROBOTIC BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '65px', height: '65px', background: '#000', border: '2px solid #00f2ff',
                    color: '#00f2ff', cursor: 'pointer', boxShadow: '0 0 15px #00f2ff',
                    clipPath: 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}
            >
                {isOpen ? 'X' : 'Assist'}
            </button>

            {/* ROBOTIC INTERFACE */}
            {isOpen && (
                <div style={{
                    position: 'absolute', bottom: '75px', right: '0', width: '320px', height: '480px',
                    background: 'rgba(5, 10, 15, 0.98)', border: '1px solid #00f2ff',
                    boxShadow: '0 0 30px rgba(0, 242, 255, 0.2)', display: 'flex', flexDirection: 'column',
                    clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)', overflow: 'hidden'
                }}>
                    <div style={{ padding: '10px', background: '#00f2ff22', color: '#00f2ff', fontSize: '11px', borderBottom: '1px solid #00f2ff44' }}>
                        STATUS: ACTIVE // UNIT_01
                    </div>

                    <div ref={scrollRef} style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                <div style={{
                                    background: m.role === 'user' ? '#00f2ff11' : '#111',
                                    border: m.role === 'user' ? '1px solid #00f2ff' : '1px solid #333',
                                    padding: '10px', color: '#00f2ff', fontSize: '13px'
                                }}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && <div style={{ color: '#00f2ff', fontSize: '11px', padding: '10px' }}>[LOADING...]</div>}
                    </div>

                    {/* MOBILE SEND BUTTON ADDED HERE */}
                    <div style={{ padding: '15px', background: '#000', borderTop: '1px solid #00f2ff33' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                value={input} onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="COMMAND >"
                                style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #00f2ff', color: '#00f2ff', outline: 'none' }}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    background: 'transparent', border: '1px solid #00f2ff', color: '#00f2ff',
                                    padding: '5px 10px', cursor: 'pointer', fontSize: '12px'
                                }}
                            >
                                SEND
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}