drop extension if exists "pg_net";

create extension if not exists "pg_net" with schema "public";

create sequence "public"."audit_log_id_seq";

create sequence "public"."jobs_id_seq";


  create table "public"."audit_log" (
    "id" integer not null default nextval('public.audit_log_id_seq'::regclass),
    "event_type" text,
    "details" text,
    "signature" text,
    "timestamp" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
      );


alter table "public"."audit_log" enable row level security;


  create table "public"."introduction_ledger" (
    "hash" text not null,
    "employer_id" text,
    "candidate_id" text,
    "notified_at" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "expiry_date" timestamp(3) without time zone,
    "fee_status" text default 'PENDING'::text
      );


alter table "public"."introduction_ledger" enable row level security;


  create table "public"."jobs" (
    "id" integer not null default nextval('public.jobs_id_seq'::regclass),
    "title" text,
    "company" text,
    "location" text,
    "sector" text,
    "salary" text,
    "description" text
      );


alter table "public"."jobs" enable row level security;


  create table "public"."permit_status" (
    "user_id" text not null,
    "current_step" integer not null default 1,
    "last_updated" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
      );


alter table "public"."permit_status" enable row level security;

alter sequence "public"."audit_log_id_seq" owned by "public"."audit_log"."id";

alter sequence "public"."jobs_id_seq" owned by "public"."jobs"."id";

CREATE UNIQUE INDEX audit_log_pkey ON public.audit_log USING btree (id);

CREATE UNIQUE INDEX introduction_ledger_pkey ON public.introduction_ledger USING btree (hash);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

CREATE UNIQUE INDEX permit_status_pkey ON public.permit_status USING btree (user_id);

alter table "public"."audit_log" add constraint "audit_log_pkey" PRIMARY KEY using index "audit_log_pkey";

alter table "public"."introduction_ledger" add constraint "introduction_ledger_pkey" PRIMARY KEY using index "introduction_ledger_pkey";

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

alter table "public"."permit_status" add constraint "permit_status_pkey" PRIMARY KEY using index "permit_status_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

grant delete on table "public"."audit_log" to "anon";

grant insert on table "public"."audit_log" to "anon";

grant references on table "public"."audit_log" to "anon";

grant select on table "public"."audit_log" to "anon";

grant trigger on table "public"."audit_log" to "anon";

grant truncate on table "public"."audit_log" to "anon";

grant update on table "public"."audit_log" to "anon";

grant delete on table "public"."audit_log" to "authenticated";

grant insert on table "public"."audit_log" to "authenticated";

grant references on table "public"."audit_log" to "authenticated";

grant select on table "public"."audit_log" to "authenticated";

grant trigger on table "public"."audit_log" to "authenticated";

grant truncate on table "public"."audit_log" to "authenticated";

grant update on table "public"."audit_log" to "authenticated";

grant delete on table "public"."audit_log" to "service_role";

grant insert on table "public"."audit_log" to "service_role";

grant references on table "public"."audit_log" to "service_role";

grant select on table "public"."audit_log" to "service_role";

grant trigger on table "public"."audit_log" to "service_role";

grant truncate on table "public"."audit_log" to "service_role";

grant update on table "public"."audit_log" to "service_role";

grant delete on table "public"."introduction_ledger" to "anon";

grant insert on table "public"."introduction_ledger" to "anon";

grant references on table "public"."introduction_ledger" to "anon";

grant select on table "public"."introduction_ledger" to "anon";

grant trigger on table "public"."introduction_ledger" to "anon";

grant truncate on table "public"."introduction_ledger" to "anon";

grant update on table "public"."introduction_ledger" to "anon";

grant delete on table "public"."introduction_ledger" to "authenticated";

grant insert on table "public"."introduction_ledger" to "authenticated";

grant references on table "public"."introduction_ledger" to "authenticated";

grant select on table "public"."introduction_ledger" to "authenticated";

grant trigger on table "public"."introduction_ledger" to "authenticated";

grant truncate on table "public"."introduction_ledger" to "authenticated";

grant update on table "public"."introduction_ledger" to "authenticated";

grant delete on table "public"."introduction_ledger" to "service_role";

grant insert on table "public"."introduction_ledger" to "service_role";

grant references on table "public"."introduction_ledger" to "service_role";

grant select on table "public"."introduction_ledger" to "service_role";

grant trigger on table "public"."introduction_ledger" to "service_role";

grant truncate on table "public"."introduction_ledger" to "service_role";

grant update on table "public"."introduction_ledger" to "service_role";

grant delete on table "public"."jobs" to "anon";

grant insert on table "public"."jobs" to "anon";

grant references on table "public"."jobs" to "anon";

grant select on table "public"."jobs" to "anon";

grant trigger on table "public"."jobs" to "anon";

grant truncate on table "public"."jobs" to "anon";

grant update on table "public"."jobs" to "anon";

grant delete on table "public"."jobs" to "authenticated";

grant insert on table "public"."jobs" to "authenticated";

grant references on table "public"."jobs" to "authenticated";

grant select on table "public"."jobs" to "authenticated";

grant trigger on table "public"."jobs" to "authenticated";

grant truncate on table "public"."jobs" to "authenticated";

grant update on table "public"."jobs" to "authenticated";

grant delete on table "public"."jobs" to "service_role";

grant insert on table "public"."jobs" to "service_role";

grant references on table "public"."jobs" to "service_role";

grant select on table "public"."jobs" to "service_role";

grant trigger on table "public"."jobs" to "service_role";

grant truncate on table "public"."jobs" to "service_role";

grant update on table "public"."jobs" to "service_role";

grant delete on table "public"."permit_status" to "anon";

grant insert on table "public"."permit_status" to "anon";

grant references on table "public"."permit_status" to "anon";

grant select on table "public"."permit_status" to "anon";

grant trigger on table "public"."permit_status" to "anon";

grant truncate on table "public"."permit_status" to "anon";

grant update on table "public"."permit_status" to "anon";

grant delete on table "public"."permit_status" to "authenticated";

grant insert on table "public"."permit_status" to "authenticated";

grant references on table "public"."permit_status" to "authenticated";

grant select on table "public"."permit_status" to "authenticated";

grant trigger on table "public"."permit_status" to "authenticated";

grant truncate on table "public"."permit_status" to "authenticated";

grant update on table "public"."permit_status" to "authenticated";

grant delete on table "public"."permit_status" to "service_role";

grant insert on table "public"."permit_status" to "service_role";

grant references on table "public"."permit_status" to "service_role";

grant select on table "public"."permit_status" to "service_role";

grant trigger on table "public"."permit_status" to "service_role";

grant truncate on table "public"."permit_status" to "service_role";

grant update on table "public"."permit_status" to "service_role";


