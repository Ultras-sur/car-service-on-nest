import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, LoggerService } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { UserServicePG } from './pg-user.service';
import { User } from '../../../entities/user.entity';
import { UserPageOptionsDTO } from './dto/user-page-options.dto';
import { UserRole } from 'entities/user.entity';
import { PageMetaDTO } from './dto/page-meta.dto';
import { type } from 'os';

describe('UserServicePG', () => {
  let app: INestApplication;
  let userServicePG;
  const fewRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER];
  const namesToMatch = ['user', 'ser', 'us', 'se'];
  const loginsToMatch = ['admin', 'in', 'dm', 'ad'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userServicePG = app.get<UserServicePG>(UserServicePG);
  });

  afterAll(async () => {
    await app.close();
  });
  it('should be defined', () => {
    expect(userServicePG).toBeDefined();
  });

  describe('findUsersPaginate', () => {
    it('returned array of User entity', async () => {
      const { data, meta } = await userServicePG.findUsersPaginate(
        new UserPageOptionsDTO({}),
      );
      expect(Array.isArray(data)).toBe(true);
      data.forEach((user) => {
        expect(user).toBeInstanceOf(User);
      });
    });

    Object.keys(UserRole).forEach((role) => {
      it(`returned user with role ${role}`, async () => {
        const findedUsers = await userServicePG.findUsersPaginate(
          new UserPageOptionsDTO({ roles: [role] }),
        );
        findedUsers.data.forEach((user) => {
          expect(user.roles.includes(role)).toBe(true);
        });
      });
    });

    it(`returned user with few roles ${fewRoles}`, async () => {
      const findedUsers = await userServicePG.findUsersPaginate(
        new UserPageOptionsDTO({
          roles: fewRoles,
          roles_choosed: true,
        }),
      );
      findedUsers.data.forEach((user) => {
        expect(user.roles).toEqual(fewRoles);
      });
    });

    namesToMatch.forEach((name) => {
      it(`returned name matched "${name}"`, async () => {
        const findedUsers = await userServicePG.findUsersPaginate(
          new UserPageOptionsDTO({
            name: name,
          }),
        );
        const regMatch = RegExp(`.*${name}.*`, 'mg');
        findedUsers.data.forEach((user) => {
          expect(user.name).toMatch(regMatch);
        });
      });
    });
    loginsToMatch.forEach((login) => {
      it(`returned login matched "${login}"`, async () => {
        const findedUsers = await userServicePG.findUsersPaginate(
          new UserPageOptionsDTO({
            login: login,
          }),
        );
        const regMatch = RegExp(`.*${login}.*`, 'mg');
        findedUsers.data.forEach((user) => {
          expect(user.login).toMatch(regMatch);
        });
      });
    });

    describe('PageMeta', () => {
      it('Returned page meta information', async () => {
        const result = await userServicePG.findUsersPaginate(
          new UserPageOptionsDTO({}),
        );
        expect(result.meta instanceof PageMetaDTO).toBe(true);
      });
      it('Returned total pages', async () => {
        const takes = [1, 2, 3];
        await Promise.all(
          takes.map(async (take) => {
            const [, count] = await userServicePG.findUsersAndCount({});
            const { data, meta } = await userServicePG.findUsersPaginate(
              new UserPageOptionsDTO({ take: take }),
            );
            const take_result = Math.ceil(count / take);
            expect(meta.totalPages).toBe(take_result);
          }));
        });
      });
    });
  });