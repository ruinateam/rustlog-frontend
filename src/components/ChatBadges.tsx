import React from "react";
import styled from "styled-components";
import { ChatBadgeIndex } from "../hooks/useChatBadges";

const Badges = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    flex: 0 0 auto;
`;

const Badge = styled.img`
    display: block;
    width: 18px;
    height: 18px;
    object-fit: contain;
`;

export function ChatBadges({ value, badges }: { value?: string, badges: ChatBadgeIndex }) {
    if (!value) {
        return null;
    }

    const resolved = value
        .split(",")
        .map(key => badges.get(key))
        .filter((badge): badge is NonNullable<typeof badge> => Boolean(badge));

    if (resolved.length === 0) {
        return null;
    }

    return <Badges className="badges">
        {resolved.map(badge => <Badge
            key={`${badge.setId}/${badge.version}`}
            src={badge.imageUrl1x}
            srcSet={`${badge.imageUrl1x} 1x, ${badge.imageUrl2x} 2x`}
            alt={badge.title}
            title={badge.description || badge.title}
            loading="lazy"
        />)}
    </Badges>;
}
