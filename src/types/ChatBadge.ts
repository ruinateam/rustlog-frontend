export interface ChatBadge {
    setId: string;
    version: string;
    imageUrl1x: string;
    imageUrl2x: string;
    title: string;
    description: string;
}

export interface ChatBadgesResponse {
    badges: ChatBadge[];
}
