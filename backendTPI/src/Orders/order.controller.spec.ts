//Mockea (ignora) la autenticación para que no interfiera en el test
jest.mock('../middleware/auth.middleware', () => {
  class AuthGuardMock {}
  const PermissionsMock = () => () => {};

  return {
    AuthGuard: AuthGuardMock,
    Permissions: PermissionsMock,
  };
});



//Importaciones de módulos
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UnauthorizedException } from '@nestjs/common';



//Agrupa los test en Order e instancia el service mockeado (simplificado para el test)
describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;


  //Configuración antes de cada test, donde se reemplaza el OrderService por mocks
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            updatePartial: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });



  //Verifica que el controller se haya creado correctamente.
  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });


  //Test del CREATE
  describe('create', () => {
    it('debería crear una orden', async () => {
      const dto = { name: 'Pizza' };
      const order = { id: 1, ...dto } as any;
      service.create.mockResolvedValue(order);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(order);
    });
  });


  //Test del FIND ALL
  describe('findAll', () => {
    it('debería devolver todas las órdenes si tiene permiso findAllOrder', async () => {
      const req = { user: { permissions: ['findAllOrder'] } };
      const orders = [{ id: 1, name: 'Pizza' }];
      service.findAll.mockResolvedValue(orders);

      const result = await controller.findAll(req, 1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(orders);
    });

    it('debería devolver órdenes del usuario si tiene permiso findMyOrders', async () => {
      const req = { 
        user: { permissions: ['findMyOrders'] },
        accessToken: 'abc123',
      };
      const orders = [{ id: 2, name: 'Empanadas' }];
      service.findByUserId.mockResolvedValue(orders);

      const result = await controller.findAll(req, 1, 10);

      expect(service.findByUserId).toHaveBeenCalledWith('abc123', 1, 10);
      expect(result).toEqual(orders);
    });

    it('debería tirar Unauthorized si no tiene permisos', async () => {
      const req = { user: { permissions: [] } };

      await expect(controller.findAll(req, 1, 10)).rejects.toThrow(UnauthorizedException);
    });
  });


  //Test del FIND ONE
  describe('findOne', () => {
    it('debería devolver una orden por id', async () => {
      const order = { id: 5, name: 'Milanesa' } as any;
      service.findOne.mockResolvedValue(order);

      const result = await controller.findOne('5');

      expect(service.findOne).toHaveBeenCalledWith(5);
      expect(result).toEqual(order);
    });
  });


  //Test del UPDATE
  describe('update', () => {
    it('debería actualizar una orden', async () => {
      const updateData = { name: 'Hamburguesa' };
      const order = { id: 3, ...updateData } as any;
      service.update.mockResolvedValue(order);

      const result = await controller.update('3', updateData);

      expect(service.update).toHaveBeenCalledWith(3, updateData);
      expect(result).toEqual(order);
    });
  });


  //Test del UPDATE PARTIAL
  describe('updatePartial', () => {
    it('debería actualizar parcialmente una orden', async () => {
      const updateData = { quantity: 2 };
      const order = { id: 3, name: 'Hamburguesa', quantity: 2 } as any;
      service.updatePartial.mockResolvedValue(order);

      const result = await controller.updatePartial('3', updateData);

      expect(service.updatePartial).toHaveBeenCalledWith(3, updateData);
      expect(result).toEqual(order);
    });
  });


  //Test del REMOVE
  describe('remove', () => {
    it('debería eliminar una orden', async () => {
      const msg = { message: 'Orden eliminada' };
      service.remove.mockResolvedValue(msg);

      const result = await controller.remove('7');

      expect(service.remove).toHaveBeenCalledWith(7);
      expect(result).toEqual(msg);
    });
  });
});