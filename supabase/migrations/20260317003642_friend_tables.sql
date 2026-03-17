drop policy "Users have full access to their notifications" on "public"."notifications";

alter table "public"."user_privacy" drop constraint "user_privacy_user_id_fkey";

alter table "public"."user_statistics" drop constraint "user_statistics_user_id_fkey";


  create table "public"."friend_requests" (
    "sender_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "receiver_id" uuid not null default gen_random_uuid()
      );


alter table "public"."friend_requests" enable row level security;


  create table "public"."friends" (
    "user_id_1" uuid not null default gen_random_uuid(),
    "user_id_2" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."friends" enable row level security;

CREATE UNIQUE INDEX friend_requests_pkey ON public.friend_requests USING btree (sender_id, receiver_id);

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (user_id_1, user_id_2);

alter table "public"."friend_requests" add constraint "friend_requests_pkey" PRIMARY KEY using index "friend_requests_pkey";

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."friend_requests" add constraint "friend_requests_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_receiver_id_fkey";

alter table "public"."friend_requests" add constraint "friend_requests_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_sender_id_fkey";

alter table "public"."friends" add constraint "friends_user_id_1_fkey" FOREIGN KEY (user_id_1) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_user_id_1_fkey";

alter table "public"."friends" add constraint "friends_user_id_2_fkey" FOREIGN KEY (user_id_2) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_user_id_2_fkey";

alter table "public"."user_privacy" add constraint "user_privacy_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."user_privacy" validate constraint "user_privacy_user_id_fkey";

alter table "public"."user_statistics" add constraint "user_statistics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE not valid;

alter table "public"."user_statistics" validate constraint "user_statistics_user_id_fkey";

grant delete on table "public"."friend_requests" to "anon";

grant insert on table "public"."friend_requests" to "anon";

grant references on table "public"."friend_requests" to "anon";

grant select on table "public"."friend_requests" to "anon";

grant trigger on table "public"."friend_requests" to "anon";

grant truncate on table "public"."friend_requests" to "anon";

grant update on table "public"."friend_requests" to "anon";

grant delete on table "public"."friend_requests" to "authenticated";

grant insert on table "public"."friend_requests" to "authenticated";

grant references on table "public"."friend_requests" to "authenticated";

grant select on table "public"."friend_requests" to "authenticated";

grant trigger on table "public"."friend_requests" to "authenticated";

grant truncate on table "public"."friend_requests" to "authenticated";

grant update on table "public"."friend_requests" to "authenticated";

grant delete on table "public"."friend_requests" to "service_role";

grant insert on table "public"."friend_requests" to "service_role";

grant references on table "public"."friend_requests" to "service_role";

grant select on table "public"."friend_requests" to "service_role";

grant trigger on table "public"."friend_requests" to "service_role";

grant truncate on table "public"."friend_requests" to "service_role";

grant update on table "public"."friend_requests" to "service_role";

grant delete on table "public"."friends" to "anon";

grant insert on table "public"."friends" to "anon";

grant references on table "public"."friends" to "anon";

grant select on table "public"."friends" to "anon";

grant trigger on table "public"."friends" to "anon";

grant truncate on table "public"."friends" to "anon";

grant update on table "public"."friends" to "anon";

grant delete on table "public"."friends" to "authenticated";

grant insert on table "public"."friends" to "authenticated";

grant references on table "public"."friends" to "authenticated";

grant select on table "public"."friends" to "authenticated";

grant trigger on table "public"."friends" to "authenticated";

grant truncate on table "public"."friends" to "authenticated";

grant update on table "public"."friends" to "authenticated";

grant delete on table "public"."friends" to "service_role";

grant insert on table "public"."friends" to "service_role";

grant references on table "public"."friends" to "service_role";

grant select on table "public"."friends" to "service_role";

grant trigger on table "public"."friends" to "service_role";

grant truncate on table "public"."friends" to "service_role";

grant update on table "public"."friends" to "service_role";


  create policy "Users can see their own requests"
  on "public"."friend_requests"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.uid() AS uid) = sender_id) OR (( SELECT auth.uid() AS uid) = receiver_id)));



  create policy "People can see everyone's friends"
  on "public"."friends"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users have full access their own notifications"
  on "public"."notifications"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



