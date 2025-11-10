import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
import type { AchievementType } from "../../../src/types/enums.ts";
import { checkFlashcardCompletions, checkFlashcardCreations, checkQuizCompletions, checkQuizCreations } from "./achievementChecks.ts";

interface AchievementCheck {
  type: AchievementType,
  user_id: string,
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { user_id, type } = await req.json() as AchievementCheck;
    const toBeUnlocked: {
      achievement_id: string,
      title: string,
      description: string,
      xp: number
    }[] = []

    const userAchievements = await supabaseAdmin.from('unlocked_achievements')
      .select('achievement_id')
      .eq('user_id', user_id)

    if (userAchievements.error) throw new Error(userAchievements.error.message || JSON.stringify(userAchievements.error));

    const unlocked: string[] = userAchievements.data.map(a => a.achievement_id);
    console.log(unlocked);

    const achievements = await supabaseAdmin.from('achievements')
      .select()
      .eq('type', type)
      .not('id', 'in', `(${unlocked.join(",")})`)

    if (achievements.error) throw new Error(achievements.error.message || JSON.stringify(achievements.error));

    console.log(achievements.data);

    for (const achievement of achievements.data) {
      let unlocked = false;
      switch (achievement.type) {
        case 'quizzes_completed':
          unlocked = await checkQuizCompletions(user_id, achievement.unlock_criteria);
          break;
        case 'quizzes_perfected':
          unlocked = await checkQuizCompletions(user_id, achievement.unlock_criteria, true);
          break;
        case 'quizzes_created':
          unlocked = await checkQuizCreations(user_id, achievement.unlock_criteria);
          break;
        case 'flashcards_completed':
          unlocked = await checkFlashcardCompletions(user_id, achievement.unlock_criteria);
          break;
        case 'flashcards_created':
          unlocked = await checkFlashcardCreations(user_id, achievement.unlock_criteria);
          break;
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

    const { error: achievementError } = await supabaseAdmin.from('unlocked_achievements')
      .insert(toBeUnlocked.map(a => ({user_id, achievement_id: a.achievement_id})))
      .select()
    
    if (achievementError) throw new Error(achievementError.message || JSON.stringify(achievementError));

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