import { feed, students } from '@/lib/data';

export async function getStudentFromDb(studentId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return students.find((item) => item.id === studentId) ?? students[0];
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data, error } = await supabase.from('students').select('*').eq('id', studentId).single();

  if (error || !data) {
    return students.find((item) => item.id === studentId) ?? students[0];
  }

  return {
    ...students.find((item) => item.id === studentId),
    ...data,
  };
}

export async function getFeedFromDb() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return feed;
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase.from('feed_posts').select('*').order('published_at', { ascending: false }).limit(10);

  if (!data?.length) return feed;

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.body,
    audience: item.audience,
    createdAt: item.published_at,
    type: item.type,
  }));
}
