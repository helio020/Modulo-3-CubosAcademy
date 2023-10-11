create table users (
  id serial primary key,
  name text not null,
  email text not null unique,
  password text not null
);

create table pokemons (
  id serial primary key,
  user_id integer not null references users(id),
  name text not null,
  skills text not null,
  image text,
  nickname text
);