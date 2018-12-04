DROP TABLE IF EXISTS "ruoli";
DROP TABLE IF EXISTS "task_in_exams";
DROP TABLE IF EXISTS "multiple_choices";
DROP TABLE IF EXISTS "review";
DROP TABLE IF EXISTS "submission";
DROP TABLE IF EXISTS "classe";
DROP TABLE IF EXISTS "task";
DROP TABLE IF EXISTS "exam";
DROP TABLE IF EXISTS "user";

CREATE TABLE "user"
(
"id" serial PRIMARY KEY,
"name" VARCHAR(50),
"surname" VARCHAR(50),
"email" VARCHAR(50) UNIQUE NOT NULL,
"password" VARCHAR(50) NOT NULL
);

CREATE TABLE "task"
(
	"id" serial PRIMARY KEY,
	"creator" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"task_type" integer NOT NULL,
	"question" varchar(2000) NOT NULL,
	"example" varchar(2000),
	"mark" integer NOT NULL
	);

CREATE TABLE "exam"
(
	"id" serial PRIMARY KEY,
	"creator" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"deadline" integer,
	"mark" integer
);

CREATE TABLE "classe"
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

CREATE TABLE "ruoli"
(
	"user" integer REFERENCES "user"("id") ON DELETE CASCADE,
	"classe" integer REFERENCES "classe"("id") ON DELETE CASCADE,
	"permesso" integer NOT NULL,
	PRIMARY KEY("user","classe")
);

CREATE TABLE "multiple_choices"
(
	"id" serial PRIMARY KEY,
	"task" integer REFERENCES "task"("id") ON DELETE CASCADE,
	"answer" VARCHAR(2000)
);

INSERT INTO "user" ("name", "surname", "email", "password") VALUES ('francesco', 'da dalt', 'francescodadalt@hotmail.it', 'lol');
INSERT INTO "user" ("name", "surname", "email", "password") VALUES ('vanes', 'carrer', 'vanescarrer@hotmail.it', 'dota');
INSERT INTO "user" ("name", "surname", "email", "password") VALUES ('asia', 'salvaterra', 'asiasalva@hotmail.it', 'acr');
INSERT INTO "user" ("name", "surname", "email", "password") VALUES ('stefano', 'branchi', 'stefanobranchi@hotmail.it', 'crl');

INSERT INTO "user" ("name", "surname", "email", "password") VALUES ('Utente', 'Utente', 'blllll', 'password');

INSERT INTO "task" ("creator", "task_type", "question", "example", "mark") VALUES (1, 1, 'blablabla', 'blablabla', 30);
INSERT INTO "task" ("creator", "task_type", "question", "example", "mark") VALUES (1, 0, 'blablabla2', 'blablabla2', 30);
INSERT INTO "exam" ("creator", "deadline", "mark") VALUES (1, 500, 30);
INSERT INTO "exam" ("creator", "deadline", "mark") VALUES (1, 200, 30);

INSERT INTO "task_in_exams" VALUES(1,1);
INSERT INTO "task_in_exams" VALUES(2,1);
INSERT INTO "multiple_choices" ("task", "answer") VALUES (1,'Yes');
INSERT INTO "multiple_choices" ("task", "answer") VALUES (1, 'No');

INSERT INTO "classe" ("name","prof","description") VALUES ('class1', 1, 'Course of SE');
INSERT INTO "ruoli" ("user", "classe", "permesso") VALUES (1,1,1); --1 = assistente
INSERT INTO "ruoli" ("user", "classe", "permesso") VALUES (2,1,0); --0 = prof
INSERT INTO "ruoli" ("user", "classe", "permesso") VALUES (3,1,2); --2 = studente
INSERT INTO "ruoli" ("user", "classe", "permesso") VALUES (4,1,2);
INSERT INTO "submission" ("user","task","exam","answer","final_mark") VALUES (1,1,1,'CIAO',30);
INSERT INTO "review" ("reviewer","submission","review_answer","deadline") VALUES (1,1,'BELLO',200);

SELECT * FROM "user";
SELECT * FROM "task";
SELECT * FROM "classe";
SELECT * FROM "ruoli";
SELECT * FROM "task_in_exams";
SELECT * FROM "multiple_choices";
SELECT * FROM "review";
SELECT * FROM "submission";
SELECT "user" FROM "ruoli" WHERE classe=1 AND permesso=2;
SELECT * FROM "submission";
SELECT * FROM "submission" WHERE "user"=1;
SELECT * FROM "review" WHERE reviewer=1;
SELECT * FROM "user"
