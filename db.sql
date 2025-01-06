CREATE TABLE IF NOT EXISTS public.users_revenue
(
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    revenue bigint NOT NULL DEFAULT 0,
    CONSTRAINT users_revenue_pkey PRIMARY KEY (user_id)
)