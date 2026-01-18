CREATE TABLE public.users (
   id integer NOT NULL,
   username text NOT NULL,
   created_at timestamp without time zone DEFAULT now(),
   password_hash text NOT NULL
);

CREATE SEQUENCE public.users_id_seq
   AS integer
   OWNED BY public.users.id;

ALTER TABLE public.users
   ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq');

ALTER TABLE public.users
   ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE public.users
   ADD CONSTRAINT users_username_key UNIQUE (username);


CREATE TABLE public.topics (
   id integer NOT NULL,
   name text NOT NULL
);

CREATE SEQUENCE public.topics_id_seq
   AS integer
   OWNED BY public.topics.id;

ALTER TABLE public.topics
   ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq');

ALTER TABLE public.topics
   ADD CONSTRAINT topics_pkey PRIMARY KEY (id);

ALTER TABLE public.topics
   ADD CONSTRAINT topics_name_key UNIQUE (name);


CREATE TABLE public.posts (
   id integer NOT NULL,
   posted_by integer NOT NULL,
   title text NOT NULL,
   description text NOT NULL,
   posted_on timestamp without time zone DEFAULT now(),
   topic integer
);

CREATE SEQUENCE public.posts_id_seq
   AS integer
   OWNED BY public.posts.id;

ALTER TABLE public.posts
   ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq');

ALTER TABLE public.posts
   ADD CONSTRAINT posts_pkey PRIMARY KEY (id);

ALTER TABLE public.posts
   ADD CONSTRAINT posts_posted_by_fkey
      FOREIGN KEY (posted_by)
      REFERENCES public.users(id)
      ON DELETE CASCADE;

ALTER TABLE public.posts
   ADD CONSTRAINT posts_topic_fkey
      FOREIGN KEY (topic)
      REFERENCES public.topics(id)
      ON DELETE RESTRICT;


CREATE TABLE public.comments (
   id integer NOT NULL,
   post_id integer NOT NULL,
   commented_by integer NOT NULL,
   content text NOT NULL,
   commented_on timestamp without time zone DEFAULT now()
);

CREATE SEQUENCE public.comments_id_seq
   AS integer
   OWNED BY public.comments.id;

ALTER TABLE public.comments
   ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq');

ALTER TABLE public.comments
   ADD CONSTRAINT comments_pkey PRIMARY KEY (id);

ALTER TABLE public.comments
   ADD CONSTRAINT comments_post_id_fkey
      FOREIGN KEY (post_id)
      REFERENCES public.posts(id)
      ON DELETE CASCADE;

ALTER TABLE public.comments
   ADD CONSTRAINT comments_commented_on_fkey
      FOREIGN KEY (commented_by)
      REFERENCES public.users(id)
      ON DELETE CASCADE;


CREATE TABLE public.post_votes (
   post_id integer NOT NULL,
   user_id integer NOT NULL,
   vote_type integer
);

ALTER TABLE public.post_votes
   ADD CONSTRAINT post_votes_pkey
      PRIMARY KEY (post_id, user_id);

ALTER TABLE public.post_votes
   ADD CONSTRAINT post_votes_vote_type_check
      CHECK (vote_type = ANY (ARRAY[1, -1]));

ALTER TABLE public.post_votes
   ADD CONSTRAINT post_votes_post_id_fkey
      FOREIGN KEY (post_id)
      REFERENCES public.posts(id)
      ON DELETE CASCADE;

ALTER TABLE public.post_votes
   ADD CONSTRAINT post_votes_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES public.users(id)
      ON DELETE CASCADE;


CREATE TABLE public.comment_votes (
   comment_id integer NOT NULL,
   user_id integer NOT NULL,
   vote_type integer
);

ALTER TABLE public.comment_votes
   ADD CONSTRAINT comment_votes_pkey
      PRIMARY KEY (comment_id, user_id);

ALTER TABLE public.comment_votes
   ADD CONSTRAINT comment_votes_vote_type_check
      CHECK (vote_type = ANY (ARRAY[1, -1]));

ALTER TABLE public.comment_votes
   ADD CONSTRAINT comment_votes_comment_id_fkey
      FOREIGN KEY (comment_id)
      REFERENCES public.comments(id)
      ON DELETE CASCADE;

ALTER TABLE public.comment_votes
   ADD CONSTRAINT comment_votes_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES public.users(id)
      ON DELETE CASCADE;

INSERT INTO public.topics (name)
VALUES
   ('art'),
   ('culture'),
   ('education'),
   ('environment'),
   ('finance'),
   ('food'),
   ('gardening'),
   ('health'),
   ('history'),
   ('literature'),
   ('music'),
   ('photography'),
   ('politics'),
   ('science'),
   ('sports'),
   ('technology'),
   ('travel');


