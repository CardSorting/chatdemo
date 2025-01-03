import { supabase } from './supabase';

export interface Companion {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  creator_id: string;
  creator_name: string;
  likes_count: number;
  messages_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  chat_url: string;
  status: string;
  moderation_feedback?: string;
  moderated_at?: string;
  moderated_by?: string;
  screenshots: string[];
}

export const fetchCompanions = async (): Promise<Companion[]> => {
  try {
    const { data, error } = await supabase
      .from('companions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(companion => ({
      id: companion.id,
      name: companion.name,
      description: companion.description,
      avatar_url: companion.avatar_url,
      creator_id: companion.creator_id,
      creator_name: companion.creator_name,
      likes_count: companion.likes_count,
      messages_count: companion.messages_count,
      tags: companion.tags || [],
      created_at: companion.created_at,
      updated_at: companion.updated_at,
      chat_url: companion.chat_url,
      status: companion.status,
      moderation_feedback: companion.moderation_feedback,
      moderated_at: companion.moderated_at,
      moderated_by: companion.moderated_by,
      screenshots: companion.screenshots || []
    }));
  } catch (error) {
    console.error('Error fetching companions:', error);
    return [];
  }
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
      description: data.description,
      avatar_url: data.avatar_url,
      creator_id: data.creator_id,
      creator_name: data.creator_name,
      likes_count: data.likes_count,
      messages_count: data.messages_count,
      tags: data.tags || [],
      created_at: data.created_at,
      updated_at: data.updated_at,
      chat_url: data.chat_url,
      status: data.status,
      moderation_feedback: data.moderation_feedback,
      moderated_at: data.moderated_at,
      moderated_by: data.moderated_by,
      screenshots: data.screenshots || []
    };
  } catch (error) {
    console.error('Error fetching companion:', error);
    return null;
  }
};

export const uploadScreenshots = async (companionId: string, screenshots: File[]): Promise<string[]> => {
  try {
    const uploadPromises = screenshots.map(async (file) => {
      const filePath = `companions/${companionId}/screenshots/${file.name}`;
      const { data, error } = await supabase
        .storage
        .from('companion-screenshots')
        .upload(filePath, file);

      if (error) throw error;
      return data.path;
    });

    const paths = await Promise.all(uploadPromises);
    return paths;
  } catch (error) {
    console.error('Error uploading screenshots:', error);
    throw error;
  }
};

export const getScreenshotUrls = async (paths: string[]): Promise<string[]> => {
  try {
    const urlPromises = paths.map(async (path) => {
      const { data } = supabase
        .storage
        .from('companion-screenshots')
        .getPublicUrl(path);
      return data.publicUrl;
    });

    return await Promise.all(urlPromises);
  } catch (error) {
    console.error('Error getting screenshot URLs:', error);
    throw error;
  }
};