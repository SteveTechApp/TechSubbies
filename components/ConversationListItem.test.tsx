import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConversationListItem } from './ConversationListItem';
import type { Conversation, UserProfile } from '../types';

describe('ConversationListItem', () => {
  it('shows the durable unread count returned by the backend', () => {
    const conversation = {
      id: 'conversation-1',
      participantIds: ['user-1', 'user-2'],
      lastMessageTimestamp: new Date(),
      lastMessageText: 'New site details are ready.',
      unreadCount: 3,
    } as Conversation & { unreadCount: number };

    render(
      <ConversationListItem
        conversation={conversation}
        otherParticipant={{ name: 'Alex Engineer', avatar: '/avatar.png' } as UserProfile}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByLabelText('3 unread messages')).toHaveTextContent('3');
    expect(screen.getByText('New site details are ready.')).toBeVisible();
  });
});
