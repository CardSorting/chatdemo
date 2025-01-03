import { supabase } from './supabase';

export interface Companion {
  id: string;
  name: string;
  creator_name: string;
  creator_id: string;
  avatar_url: string;
  description?: string;
  messages_count: number;
  likes_count: number;
  chat_url: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
}

export const fetchCompanions = async (): Promise<Companion[]> => {
  // TODO: Implement actual data fetching logic
  return [
    {
      id: "1",
      name: "Example Companion",
      creator_name: "Creator",
      creator_id: "1",
      avatar_url: "https://example.com/avatar.jpg",
      description: "This is an example companion",
      messages_count: 100,
      likes_count: 50,
      chat_url: "https://example.com/chat",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_featured: false
    }
  ];
};

export const getCompanion = async (id: string): Promise<Companion | null> => {
  try {
    const { data, error } = await supabase
      .from('companions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      creator_name: data.creator_name,
      creator_id: data.creator_id,
      avatar_url: data.avatar_url,
      description: data.description,
      messages_count: data.messages_count,
      likes_count: data.likes_count,
      chat_url: data.chat_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_featured: data.is_featured
    };
  } catch (error) {
    console.error('Error fetching companion:', error);
    return null;
  }
};