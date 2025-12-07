import { supabase } from "@lib/supabaseClient";

async function getAccumulatedStats(userId: string) {
  const { data, error } = await supabase.from('user_statistics')
    .select()
    .eq('user_id', userId);

  if (error) {
    console.error('Could not get user statistics: ', error);
    throw new Error('Could not get user statistics: ', error);
  }

  const totals = data.reduce((acc: Record<string, number>, row) => {
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === "number") {
        acc[key] = (acc[key] || 0) + value
      }
    }
    return acc;
  }, {} as Record<string, number>)

  return totals;
}

export default { getAccumulatedStats };