alter table "public"."users" add column "profile_picture" text not null default 'defaultProfilePicture'::text;

alter table "public"."users" add column "profile_picture_updated_at" timestamp with time zone not null default now();


  create policy "Access to profile pictures 1o29iim_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'profilePictures'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Access to profile pictures 1o29iim_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'profilePictures'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Access to profile pictures 1o29iim_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'profilePictures'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Access to profile pictures 1o29iim_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'profilePictures'::text) AND (auth.role() = 'authenticated'::text)));



