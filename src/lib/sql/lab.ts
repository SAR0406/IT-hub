/**
 * SQL Playground — client-side sandbox data. Everything here runs inside the
 * student's browser via PGlite (WebAssembly Postgres). The real database is
 * never touched.
 */

export const LAB_SEED_SQL = `
create table students (
  id integer primary key,
  name text not null,
  class_name text not null,
  city text not null
);
insert into students values
  (1, 'Aarav', 'XI-A', 'Delhi'),
  (2, 'Ananya', 'XI-A', 'Mumbai'),
  (3, 'Ishaan', 'XI-B', 'Kolkata'),
  (4, 'Priya', 'XI-B', 'Chennai'),
  (5, 'Kabir', 'XI-A', 'Delhi');

create table marks (
  student_id integer,
  subject text not null,
  marks integer not null
);
insert into marks values
  (1, 'IT', 92), (1, 'Maths', 78),
  (2, 'IT', 85), (2, 'Maths', 88),
  (3, 'IT', 74), (3, 'Maths', 69),
  (4, 'IT', 95), (4, 'Maths', 91),
  (5, 'IT', 61), (5, 'Maths', 72);

create table subjects (
  id integer primary key,
  name text not null,
  code text not null
);
insert into subjects values
  (1, 'Information Technology', 'IT-402'),
  (2, 'Mathematics', 'MAT-41'),
  (3, 'English', 'ENG-01');
`;

export type LabMission = {
  id: string;
  title: string;
  hint: string;
  solution: string;
};

export const LAB_MISSIONS: LabMission[] = [
  {
    id: "m1",
    title: "Show every row in the students table",
    hint: "SELECT … FROM … — select everything with a star.",
    solution: "SELECT * FROM students;",
  },
  {
    id: "m2",
    title: "Find the students in class XI-A",
    hint: "Add a WHERE clause comparing class_name.",
    solution: "SELECT * FROM students WHERE class_name = 'XI-A';",
  },
  {
    id: "m3",
    title: "List students in alphabetical order",
    hint: "ORDER BY the name column.",
    solution: "SELECT * FROM students ORDER BY name;",
  },
  {
    id: "m4",
    title: "Names that start with the letter A",
    hint: "Use LIKE with a pattern: 'A%'.",
    solution: "SELECT * FROM students WHERE name LIKE 'A%';",
  },
  {
    id: "m5",
    title: "Marks between 80 and 100 (both included)",
    hint: "BETWEEN works on numbers.",
    solution: "SELECT * FROM marks WHERE marks BETWEEN 80 AND 100;",
  },
  {
    id: "m6",
    title: "List every distinct subject once",
    hint: "DISTINCT removes duplicates.",
    solution: "SELECT DISTINCT subject FROM marks;",
  },
];

export type LabErrorTip = {
  match: RegExp;
  tip: string;
};

export const LAB_ERROR_TIPS: LabErrorTip[] = [
  {
    match: /syntax error/i,
    tip: "Check your spelling and make sure every command ends with a semicolon (;).",
  },
  {
    match: /does not exist/i,
    tip: "That table or column doesn't exist. Check the names in the schema panel.",
  },
  {
    match: /duplicate key/i,
    tip: "That value already exists — primary keys must be unique.",
  },
  {
    match: /not null/i,
    tip: "That column cannot be empty — every row needs a value for it.",
  },
  {
    match: /foreign key/i,
    tip: "The value you inserted doesn't match a row in the referenced table.",
  },
];