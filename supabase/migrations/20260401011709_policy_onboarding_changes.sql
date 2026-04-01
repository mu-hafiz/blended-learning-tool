drop policy "People can see everyone's friends" on "public"."friends";

drop policy "Users can see everyone's achievements" on "public"."unlocked_achievements";

drop policy "Everyone can see everyone's privacy" on "public"."user_privacy";

drop policy "Everyone can see everyone's statistics" on "public"."user_statistics";


  create policy "Users can see friends of users who have done onboarding"
  on "public"."friends"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE (((u.user_id = friends.user_id_1) OR (u.user_id = friends.user_id_1)) AND ((u.onboarding_completed = true) OR (u.user_id = auth.uid()))))));



  create policy "Users can see achievements of users who have done onboarding"
  on "public"."unlocked_achievements"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.user_id = unlocked_achievements.user_id) AND ((u.onboarding_completed = true) OR (u.user_id = auth.uid()))))));



  create policy "Users can see privacy settings of users who have done onboardin"
  on "public"."user_privacy"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.user_id = user_privacy.user_id) AND ((u.onboarding_completed = true) OR (u.user_id = auth.uid()))))));



  create policy "Users can see statistics of users who have done onboarding"
  on "public"."user_statistics"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.user_id = user_statistics.user_id) AND ((u.onboarding_completed = true) OR (u.user_id = auth.uid()))))));



