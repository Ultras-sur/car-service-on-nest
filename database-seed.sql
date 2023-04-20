-- Active: 1680558457888@@0.0.0.0@5431@motora

CREATE TABLE "user" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    login VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    roles text[] DEFAULT '{USER}'
);

insert into "user" (login, name, password, roles) values ('admin', 'admin', '$2b$10$QGxLxn4hYzUJ/k00eNv3ZOjHi6j0bWFt.h7DhqNz0hlfsSSA0kUhm', '{USER,ADMIN,MANAGER}');
CREATE TABLE client (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR not null,
    "licensNumber" VARCHAR UNIQUE NOT NULL
);

CREATE TABLE car_brand (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE car_model (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    "brandId" uuid REFERENCES car_brand (id) 
);

CREATE TABLE car (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "releaseYear" INTEGER NOT NULL,
    vin VARCHAR UNIQUE NOT NULL,
    "brandId" uuid REFERENCES car_brand (id),
    "modelId" uuid REFERENCES car_model (id),
    "ownerId" uuid REFERENCES client (id)
);

CREATE TABLE job_category (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE job (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    "categoryId" uuid REFERENCES job_category (id)
);


CREATE TABLE "order" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    number VARCHAR UNIQUE NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" DATE, 
    "carId" uuid REFERENCES car (id),
    "clientId" uuid REFERENCES client (id),
    "orderStatus" VARCHAR DEFAULT 'opened',
    jobs JSONB
);

CREATE TABLE work_post
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    number VARCHAR UNIQUE NOT NULL,
    "orderId" uuid REFERENCES "order" (id)
);

INSERT INTO work_post(number) VALUES 
('1'),
('2'),
('3'),
('4'); 
