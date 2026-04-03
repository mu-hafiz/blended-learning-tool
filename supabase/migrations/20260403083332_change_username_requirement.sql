alter table "public"."users" drop constraint "users_username_check";

alter table "public"."users" add constraint "users_username_check" CHECK ((username ~ '^[a-z0-9_.]{4,30}$'::text)) not valid;

alter table "public"."users" validate constraint "users_username_check";


