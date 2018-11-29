DROP TABLE IF EXISTS "permissions";
DROP TABLE IF EXISTS "task_in_exams";
DROP TABLE IF EXISTS "review";
DROP TABLE IF EXISTS "submission";
DROP TABLE IF EXISTS "class";
DROP TABLE IF EXISTS "task";
DROP TABLE IF EXISTS "exam";
DROP TABLE IF EXISTS "user";

CREATE TABLE "user"
(
"id" serial PRIMARY KEY,
"name" VARCHAR(50),
"surname" VARCHAR(50),
"email" VARCHAR(50) UNIQUE NOT NULL,
"password" VARCHAR(50) NOT NULL);

CREATE TABLE "task"
(
	"id" serial PRIMARY KEY,
	"creator" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"task_type" integer NOT NULL,
	"question" varchar(2000) NOT NULL,
	"example" varchar(2000),
	"mark" integer NOT NULL);

CREATE TABLE "exam"
(
	id "serial" PRIMARY KEY,
	"creator" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"deadline" integer,
	"mark" integer);

CREATE TABLE "class"
(
	"id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL,
	"prof" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"description" VARCHAR(2000)
);

CREATE TABLE "submission"
(
	"id" serial PRIMARY KEY,
	"user" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"task" integer REFERENCES "task"("id") ON DELETE CASCADE,
	"exam" integer REFERENCES "exam"("id") ON DELETE CASCADE,
	"answer" VARCHAR(2000),
	"final_mark" integer
);

CREATE TABLE "review"
(
	"id" serial PRIMARY KEY,
	"reviewer" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"submission" integer REFERENCES "submission"("id") ON DELETE CASCADE,
	"review_answer" VARCHAR(2000),
	"deadline" integer
	
);

CREATE TABLE "task_in_exams"
(
	"task" integer REFERENCES "task"("id") ON DELETE CASCADE,
	"exam" integer REFERENCES "exam"("id") ON DELETE CASCADE,
	PRIMARY KEY ("task", "exam")
);

CREATE TABLE "permissions"
(
	"user" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"class" integer REFERENCES "class"("id") ON DELETE CASCADE,
	"permission" integer NOT NULL,
	PRIMARY KEY("user","class")
);

INSERT INTO "user" ("id", "name", "surname", "email", "password") VALUES (1, 'francesco', 'da dalt', 'francescodadalt@hotmail.it', 'lol');
INSERT INTO "task" ("id", "creator", "task_type", "question", "example", "mark") VALUES (1, 1, 1, 'blablabla', 'blablabla', 30);
INSERT INTO "task" ("id", "creator", "task_type", "question", "example", "mark") VALUES (2, 1, 1, 'blablabla2', 'blablabla2', 30);
INSERT INTO "exam" ("id", "creator", "deadline", "mark") VALUES (1, 1, 500, 30);
INSERT INTO "task_in_exams" VALUES(1,1);
INSERT INTO "task_in_exams" VALUES(2,1);
