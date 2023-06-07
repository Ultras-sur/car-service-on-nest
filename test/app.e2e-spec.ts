import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, LoggerService } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as session from 'express-session';
import flash = require('connect-flash');
import cookieParser = require('cookie-parser');
import passport = require('passport');
import express = require('express');
import { resolve } from 'node:path';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  //const baseURL = `http://localhost:${process.env.PORT}`;
  //const apiRequest = request(baseURL);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      session({
        secret: 'process.env.SESSION_KEY',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    await app.init();
    httpServer = app.getHttpServer();
    //httpServer.setViewEngine('pug');
    //httpServer.setBaseViewsDir('./views');
    // httpServer.setBaseViewsDir(resolve('./views'));
    // httpServer.setViewEngine('pug');
  });

  afterAll(async () => {
    await app.close();
  });

  it('/test (GET)', async () => {
    await request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ message: 'OK' });
      });
  });

  /*it('/login (GET)', async () => {
    await request(app.getHttpServer()).get('/login').expect(200);
  });*/

  it('/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/login')
      .send('email=admin&password=000999');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toEqual('/');
    console.log(response);
    /*await request(await app.getHttpServer())
      .post('/login')
      .send('email=admin&password=000999')
      .expect(302)
      .expect((res) => {
        expect(res.headers.location).toEqual('/');
      });*/
    const testSession = response.headers['set-cookie'][0].split('; ')[0];
    /*await request(await httpServer)
      .get('/')
      .set('Cookie', [testSession])
      .send()
      .expect(200);*/

    await request(app.getHttpServer())
      .post('/login')
      .send('email=admin&password=wrong_password')
      .expect(302)
      .expect((res) => {
        expect(res.headers.location).toEqual('/login');
      });
  });
});
