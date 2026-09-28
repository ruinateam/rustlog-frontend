import { useContext } from "react";
import { useQuery } from "react-query";
import { store } from "../store";
import { ChatBadge, ChatBadgesResponse } from "../types/ChatBadge";

export type ChatBadgeIndex = Map<string, ChatBadge>;

export function useChatBadges(channelId: string): ChatBadgeIndex {
    const { state } = useContext(store);
    const { data } = useQuery<ChatBadgeIndex>(["chat-badges", channelId], async () => {
        if (!channelId) {
            return new Map();
        }

        const response = await fetch(`${state.apiBaseUrl}/badges/${channelId}`);
        if (!response.ok) {
            throw new Error(`Could not load Twitch badges (${response.status})`);
        }

        const payload = await response.json() as ChatBadgesResponse;
        const index = new Map<string, ChatBadge>();
        for (const badge of payload.badges) {
            index.set(`${badge.setId}/${badge.version}`, badge);
        }
        return index;
    }, {
        enabled: Boolean(channelId),
        staleTime: 60 * 60 * 1000,
        cacheTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return data ?? new Map();
}
