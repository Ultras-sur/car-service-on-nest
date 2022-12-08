import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';


describe('ClientController', () => {
  let controller: ClientController;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [ClientService],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
  });


  describe('find all', () => {
    it('should return an array of clients', async () => {
      const result = Promise.resolve([{ _id: '63510299c38c87877de3967d', name: 'bob', licensNumber: 4758486 }, { _id: 'hdfgdfg9f', name: 'sally', licensNumber: 89498 }]);
      jest.spyOn(clientService, 'find').mockImplementation(() => result);
      expect(await controller.getClients(1, {})).toBe(result);
    });
  })
});

