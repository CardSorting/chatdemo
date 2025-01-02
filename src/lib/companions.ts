export interface Companion {
  id: string;
  name: string;
  creator_name: string;
  avatar_url?: string;
  description?: string;
  messages_count: number;
  chat_url?: string;
  rarity?: string;
  series?: string;
  card_number?: number;
  attributes?: { [key: string]: number };
  category?: string;
  bookmarkedAt?: string;
}

export const fetchCompanions = async (): Promise<Companion[]> => {
  // TODO: Implement actual data fetching logic
  return [
    {
      id: "1",
      name: "Example Companion",
      creator_name: "Creator",
      avatar_url: "https://example.com/avatar.jpg",
      description: "This is an example companion",
      messages_count: 100,
      chat_url: "https://example.com/chat",
      rarity: "common",
      series: "Base Series",
      card_number: 1,
      attributes: {
        intelligence: 80,
        creativity: 90
      },
      category: "AI"
    }
  ];
};