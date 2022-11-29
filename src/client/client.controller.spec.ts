import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from 'schemas/client.schema';


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
      const result = [{_id: '63510299c38c87877de3967d', name: 'bob', licenseNumber: '63577299c38c87800de3967d'}, {_id: 'hdfgdfg9f', name: 'sally', licenseNumber: '89498'}];
      jest.spyOn(clientService, 'find').mockImplementation(() => result);
      expect(await controller.getClients(1, {})).toBe(result);
  });
  })
});


const result = { clients: [{_id: '63510299c38c87877de3967d', name: 'bob', licenseNumber: '63577299c38c87800de3967d'}, {_id: 'hdfgdfg9f', name: 'sally', licenseNumber: '89498'}], totalPages: 1, page: 1, step: 10};