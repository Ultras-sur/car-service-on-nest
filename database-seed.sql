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

INSERT INTO car_brand (name) VALUES
('TOYOTA'),
('NISSAN'),
('MERSEDES-BENZ'),
('VOLVO'),
('MITSUBISHI');

INSERT INTO car_model (name, "brandId") VALUES
('LAND CRUSER', (SELECT id from car_brand where name = 'TOYOTA')),
('CARINA', (SELECT id from car_brand where name = 'TOYOTA')),
('MARK II', (SELECT id from car_brand where name = 'TOYOTA'));

INSERT INTO car_model (name, "brandId") VALUES
('MURANO', (SELECT id from car_brand where name = 'NISSAN')),
('LARGO', (SELECT id from car_brand where name = 'NISSAN')),
('MARCH', (SELECT id from car_brand where name = 'NISSAN'));

INSERT INTO car_model (name, "brandId") VALUES
('VITO', (SELECT id from car_brand where name = 'MERSEDES-BENZ')),
('VIANO', (SELECT id from car_brand where name = 'MERSEDES-BENZ')),
('GLC', (SELECT id from car_brand where name = 'MERSEDES-BENZ'));

INSERT INTO car_model (name, "brandId") VALUES
('850', (SELECT id from car_brand where name = 'VOLVO')),
('S90', (SELECT id from car_brand where name = 'VOLVO')),
('X70', (SELECT id from car_brand where name = 'VOLVO'));

INSERT INTO car_model (name, "brandId") VALUES
('GALANT', (SELECT id from car_brand where name = 'MITSUBISHI')),
('PAJERO', (SELECT id from car_brand where name = 'MITSUBISHI')),
('L200', (SELECT id from car_brand where name = 'MITSUBISHI'));

INSERT INTO job_category (name) VALUES
('Слесарные работы'),
('Малярные работы'),
('Диагностика электрической системы'),
('Страховая поддержка');

INSERT INTO job (name, "categoryId") VALUES
('Замена тормозных колодок', (SELECT id from job_category where name = 'Слесарные работы')),
('Замена тормозных дисков', (SELECT id from job_category where name = 'Слесарные работы')),
('Замена моторного масла', (SELECT id from job_category where name = 'Слесарные работы')),
('Замена охлаждающей жидкости', (SELECT id from job_category where name = 'Слесарные работы'));

INSERT INTO job (name, "categoryId") VALUES
('Покраска двери', (SELECT id from job_category where name = 'Малярные работы')),
('Покраска бампера', (SELECT id from job_category where name = 'Малярные работы')),
('Полировка', (SELECT id from job_category where name = 'Малярные работы'));

INSERT INTO job (name, "categoryId") VALUES
('Диагностика системы ABS', (SELECT id from job_category where name = 'Диагностика электрической системы')),
('Диагностика коробки передач', (SELECT id from job_category where name = 'Диагностика электрической системы')),
('Диагностика двигателя', (SELECT id from job_category where name = 'Диагностика электрической системы'));

INSERT INTO job (name, "categoryId") VALUES
('Оформление страхового полиса', (SELECT id from job_category where name = 'Страховая поддержка'));

insert INTO client (name, "licensNumber") VALUES
('Bob Burns', 'sd8f7s89f797'),
('Sally Gagpo', 'sdf34f4sd8f48s'),
('Bruno Fernandes', 'dsfdswef54848'),
('Garry Nevil', 'sdf324ft23fsd');