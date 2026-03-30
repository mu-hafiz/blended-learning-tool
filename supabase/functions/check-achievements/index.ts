import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
import type { Statistics } from "../../../src/types/tables.ts";

// interface AchievementCheck {
//   type: AchievementType,
//   user_id: string,
// };

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? Deno.env.get('LOCAL_SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('LOCAL_SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const getUserStats = async (user_id: string): Statistics => {
  const { data, error } = await supabaseAdmin.from('user_statistics')
    .select()
    .eq('user_id', user_id)
    .single();
  if (error) throw new Error(error.message || JSON.stringify(error));
  return data;
}

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    // Verification
    const providedSecret = req.headers.get('x-trigger-secret');
    if (!providedSecret || providedSecret !== (Deno.env.get('TRIGGER_SECRET') ?? Deno.env.get('LOCAL_TRIGGER_SECRET'))) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get variables
    const { new_row, updated_table } = await req.json();
    const toBeUnlocked: {
      achievement_id: string,
      title: string,
      description: string,
      xp: number
    }[] = []

    // Set User ID
    let user_id = "";
    if (updated_table === 'user_statistics') {
      user_id = new_row.user_id;
    } else {
      // Handle friend update
    }

    // Get Unlocked Achievements
    const userAchievements = await supabaseAdmin.from('unlocked_achievements')
      .select('achievement_id')
      .eq('user_id', user_id)

    if (userAchievements.error) throw new Error(userAchievements.error.message || JSON.stringify(userAchievements.error));

    const unlocked: string[] = userAchievements.data.map(a => a.achievement_id);
    console.log(unlocked);

    // Get Achievements that haven't been unlocked
    const achievements = await supabaseAdmin.from('achievements')
      .select()
      .not('id', 'in', `(${unlocked.join(",")})`)

    if (achievements.error) throw new Error(achievements.error.message || JSON.stringify(achievements.error));
    if (achievements.data.length <= 0) {
      console.log("Already has all achievements");
      return jsonResponse({ success: true }, 200);
    }

    console.log(achievements.data);

    // Fetch statistics
    const statistics = await getUserStats(user_id);

    // Run checks for each type of achievement
    for (const achievement of achievements.data) {
      let unlocked = false;
      switch (achievement.type) {
        case 'flashcard_sets_completed':
          unlocked = statistics.flashcard_sets_completed >= achievement.unlock_criteria.completed;
          break;
        case 'flashcard_sets_created':
          unlocked = statistics.flashcard_sets_created >= achievement.unlock_criteria.created;
          break;
        case 'flashcards_used':
          unlocked = statistics.flashcards_used >= achievement.unlock_criteria.used;
          break;
        case 'flashcards_correct':
          unlocked = statistics.flashcards_correct >= achievement.unlock_criteria.correct;
      }

      console.log(`Achievement: ${achievement.title}, Unlocked: ${unlocked}`)

      if (unlocked) {
        toBeUnlocked.push({
          achievement_id: achievement.id,
          title: `'${achievement.title}' achievement unlocked!`,
          description: `You gained ${achievement.xp}XP`,
          xp: achievement.xp
        })
      }
    }

    // Unlock required achievements
    const { error: achievementError } = await supabaseAdmin
      .from('unlocked_achievements')
      .upsert(
        toBeUnlocked.map((a) => ({
          user_id,
          achievement_id: a.achievement_id,
        })),
        {
          onConflict: 'user_id,achievement_id',
          ignoreDuplicates: true,
        }
      );
    
    if (achievementError) throw new Error(achievementError.message || JSON.stringify(achievementError));

    // Send notifications
    const { error: notifError } = await supabaseAdmin.from('notifications')
      .insert(
        toBeUnlocked.map(a => ({
          user_id,
          title: a.title,
          description: a.description,
          type: 'achievement_unlocked'
        })))
      .select();
    
    if (notifError) throw new Error(notifError.message || JSON.stringify(notifError));

    // Add XP
    await supabaseAdmin.rpc('add_to_user_xp', {
      p_user_id: user_id,
      p_amount: toBeUnlocked.reduce((acc, current) => {
        return acc + current.xp;
      }, 0)
    });

    return jsonResponse({ success: true }, 200);

  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error
      ? error.message
      : error?.message || JSON.stringify(error) || "Something went wrong";

    return jsonResponse({ error: errorMessage }, 500);
  }
});