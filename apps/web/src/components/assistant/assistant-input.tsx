'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function AssistantInput({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        borderTop: '1px solid #f0f0f0',
        background: '#fafafa',
        borderRadius: '0 0 12px 12px',
      }}
    >
      <input
        aria-label="Message pour l'assistant"
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Écrivez votre commande… ex: je veux du lait"
        type="text"
        value={value}
        style={{
          flex: 1,
          padding: '0.6rem 1rem',
          border: '1px solid #ddd',
          borderRadius: '24px',
          fontSize: '0.9rem',
          outline: 'none',
          background: disabled ? '#f5f5f5' : '#fff',
          color: '#1a1a2e',
          transition: 'border-color 0.15s',
        }}
      />
      <button
        aria-label="Envoyer le message"
        disabled={!canSend}
        onClick={submit}
        type="button"
        style={{
          padding: '0.6rem 1.25rem',
          background: canSend ? '#1a1a2e' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '24px',
          cursor: canSend ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          fontSize: '0.85rem',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s',
        }}
      >
        Envoyer
      </button>
    </div>
  );
}
