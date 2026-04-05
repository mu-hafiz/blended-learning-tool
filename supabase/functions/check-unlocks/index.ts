import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
import type { Statistics } from "../../../src/types/tables.ts";

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? Deno.env.get('LOCAL_SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('LOCAL_SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const getUserStats = async (userId: string): Statistics => {
  const { data, error } = await supabaseAdmin.from('user_statistics')
    .select()
    .eq('user_id', userId)
    .single();
  if (error) throw new Error(error.message || JSON.stringify(error));
  return data;
}

const getFriendCount = async (userId: string) => {
  const { count, error } = await supabaseAdmin.from('friends')
    .select('*', { count: 'exact', head: true })
    .or(`user_id_1.eq.${userId}, user_id_2.eq.${userId}`);
  if (error) throw new Error(error.message || JSON.stringify(error));
  return count;
}

const getLikesCount = async (userId: string) => {
  const { count, error } = await supabaseAdmin.from('flashcard_likes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw new Error(error.message || JSON.stringify(error));
  return count;
}

const getMaxFlashcardAttempts = async (userId: string) => {
  const { data, error } = await supabaseAdmin.from('flashcard_set_counts')
    .select('*')
    .eq('user_id', userId)
    .order('count', { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message || JSON.stringify(error));
  return data[0]?.count ?? 0;
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

    const { new_row, updated_table } = await req.json();

    // The friend rows have 2 user_ids, so need to check for both users
    const user_ids = [];
    if (updated_table === 'friends') {
      user_ids.push(new_row.user_id_1, new_row.user_id_2);
    } else {
      user_ids.push(new_row.user_id);
    }

    for (const user_id of user_ids) {
      const achievementsToBeUnlocked: {
        achievement_id: string,
        title: string,
        description: string,
        xp: number
      }[] = [];

      const themesToBeUnlocked: {
        theme_id: string,
        title: string,
        description: string
      }[] = [];

      // Get Unlocked Achievements
      const userAchievements = await supabaseAdmin.from('unlocked_achievements')
        .select('achievement_id')
        .eq('user_id', user_id);
      if (userAchievements.error) throw new Error(userAchievements.error.message || JSON.stringify(userAchievements.error));
      const unlockedAchievements: string[] = userAchievements.data.map(a => a.achievement_id);
      console.log(unlockedAchievements);

      // Get Achievements that haven't been unlocked
      const achievements = await supabaseAdmin.from('achievements')
        .select()
        .not('id', 'in', `(${unlockedAchievements.join(",")})`);
      if (achievements.error) throw new Error(achievements.error.message || JSON.stringify(achievements.error));
      console.log(achievements.data);

      // Get Unlocked Themes
      const userThemes = await supabaseAdmin.from('unlocked_themes')
        .select('theme_id')
        .eq('user_id', user_id);
      if (userThemes.error) throw new Error(userThemes.error.message || JSON.stringify(userThemes.error));
      const unlockedThemes: string[] = userThemes.data.map(t => t.theme_id);
      console.log(unlockedThemes);

      // Get Achievements that haven't been unlocked
      const themes = await supabaseAdmin.from('themes')
        .select()
        .not('id', 'in', `(${unlockedThemes.join(",")})`);
      if (themes.error) throw new Error(themes.error.message || JSON.stringify(themes.error));
      console.log(themes.data);

      // Fetch statistics
      let statistics;
      let friendCount;
      let maxFlashcardAttempts;
      let likeCount;
      if (achievements.data.length > 0 || themes.data.length > 0) {
        statistics = await getUserStats(user_id);
        friendCount = await getFriendCount(user_id);
        maxFlashcardAttempts = await getMaxFlashcardAttempts(user_id);
        likeCount = await getLikesCount(user_id);
      }

      // Run checks for each type of achievement
      for (const achievement of achievements.data) {
        let unlocked = false;
        switch (achievement.unlock_type) {
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
            break;
          case 'friends_made':
            unlocked = friendCount >= achievement.unlock_criteria.friends_made;
            break;
          case 'flashcard_set_repeats':
            unlocked = maxFlashcardAttempts >= achievement.unlock_criteria.repeats;
            break;
          case 'likes_given':
            unlocked = likeCount >= achievement.unlock_criteria.given;
            break;
          case 'best_streak':
            unlocked = statistics.best_streak >= achievement.unlock_criteria.streak;
            break;
          case 'days_studied':
            unlocked = statistics.days_studied >= achievement.unlock_criteria.studied;
            break;
        }
        console.log(`Achievement: ${achievement.title}, Unlocked: ${unlocked}`)
        if (unlocked) {
          achievementsToBeUnlocked.push({
            achievement_id: achievement.id,
            title: `'${achievement.title}' achievement unlocked!`,
            description: `You gained ${achievement.xp}XP`,
            xp: achievement.xp
          })
        }
      }

      // Run checks for each type of theme
      for (const theme of themes.data) {
        let unlocked = false;
        switch (theme.unlock_type) {
          case 'flashcard_sets_completed':
            unlocked = statistics.flashcard_sets_completed >= theme.unlock_criteria.completed;
            break;
          case 'flashcard_sets_created':
            unlocked = statistics.flashcard_sets_created >= theme.unlock_criteria.created;
            break;
          case 'flashcards_used':
            unlocked = statistics.flashcards_used >= theme.unlock_criteria.used;
            break;
          case 'flashcards_correct':
            unlocked = statistics.flashcards_correct >= theme.unlock_criteria.correct;
            break;
          case 'friends_made':
            unlocked = friendCount >= theme.unlock_criteria.friends_made;
            break;
          case 'flashcard_set_repeats':
            unlocked = maxFlashcardAttempts >= theme.unlock_criteria.repeats;
            break;
          case 'likes_given':
            unlocked = likeCount >= theme.unlock_criteria.given;
            break;
          case 'best_streak':
            unlocked = statistics.best_streak >= theme.unlock_criteria.streak;
            break;
          case 'days_studied':
            unlocked = statistics.days_studied >= theme.unlock_criteria.studied;
            break;
        }
        console.log(`Theme: ${theme.title}, Unlocked: ${unlocked}`)
        if (unlocked) {
          themesToBeUnlocked.push({
            theme_id: theme.id,
            title: `'${theme.title}' theme unlocked!`,
            description: `Check it out in 'account preferences'`
          })
        }
      }

      // Unlock required achievements
      const { data: newlyUnlockedAchievements, error: achievementError } = await supabaseAdmin
        .from('unlocked_achievements')
        .upsert(
          achievementsToBeUnlocked.map((a) => ({
            user_id,
            achievement_id: a.achievement_id,
          })),
          {
            onConflict: 'user_id,achievement_id',
            ignoreDuplicates: true,
          }
        )
        .select();
      if (achievementError) throw new Error(achievementError.message || JSON.stringify(achievementError));

      const actualAchievementsNotif = achievementsToBeUnlocked.filter(a => 
        newlyUnlockedAchievements?.some(newA => newA.achievement_id === a.achievement_id)
      );

      // Unlock required themes
      const { data: newlyUnlockedThemes, error: themeError } = await supabaseAdmin
        .from('unlocked_themes')
        .upsert(
          themesToBeUnlocked.map((a) => ({
            user_id,
            theme_id: a.theme_id,
          })),
          {
            onConflict: 'user_id,theme_id',
            ignoreDuplicates: true,
          }
        )
        .select();
      if (themeError) throw new Error(themeError.message || JSON.stringify(themeError));

      const actualThemesNotif = themesToBeUnlocked.filter(t => 
        newlyUnlockedThemes?.some(newT => newT.theme_id === t.theme_id)
      );

      // Send notifications
      const { error: notifError } = await supabaseAdmin.from('notifications')
        .insert([
          ...actualAchievementsNotif.map(a => ({
            user_id,
            title: a.title,
            description: a.description,
            type: 'achievement_unlocked'
          })),
          ...actualThemesNotif.map(t => ({
            user_id,
            title: t.title,
            description: t.description,
            type: 'theme_unlocked'
          }))
        ])
        .select();
      if (notifError) throw new Error(notifError.message || JSON.stringify(notifError));

      // Add XP
      const totalXP = actualAchievementsNotif.reduce((acc, curr) => acc + curr.xp, 0);
      if (totalXP > 0) {
        await supabaseAdmin.rpc('add_to_user_xp', { p_user_id: user_id, p_amount: totalXP });
      }
    }

    return jsonResponse({ success: true }, 200);

  } catch (error) {
    console.log(error);
    const errorMessage = error instanceof Error
      ? error.message
      : error?.message || JSON.stringify(error) || "Something went wrong";

    return jsonResponse({ error: errorMessage }, 500);
  }
});