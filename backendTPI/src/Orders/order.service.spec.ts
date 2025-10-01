//Importaciones de módulos
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './order';
import { Location } from './order';
import { Repository } from 'typeorm';
import { AuthHelper } from '../middleware/auth.helper';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrderService', () => {
  //Antes que nada, mapeamos los métodos a los mocks
  let service: OrderService;
  let orderRepo: jest.Mocked<Repository<Order>>;
  let locationRepo: jest.Mocked<Repository<Location>>;
  let authHelper: { getMe: jest.Mock };

  beforeEach(async () => {
    //Se crea un entorno de prueba
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            //Asignamos funciones mockeadas para no depender de la BD
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Location),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthHelper,
          useValue: {
            getMe: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepo = module.get(getRepositoryToken(Order));
    locationRepo = module.get(getRepositoryToken(Location));
    authHelper = module.get(AuthHelper);
  });

  //Test del CREATE
  describe('create', () => {
    //Ponemos valores de ejemplo
    it('debería crear un pedido con su ubicación', async () => {
      const dto = {
        userId: 1,
        restaurantId: 2,
        products: [],
        location: {
          street: 'Mitre',
          number: '555',
          cityId: 5,
          location: { lat: 1.23, lng: 4.56 },
        },
      };

      //Se asignan los valores de ejemplo a savedLocation
      const savedLocation: Location = {
      id: 99,
      street: dto.location.street,
      number: dto.location.number,
      cityId: dto.location.cityId,
      lat: dto.location.location.lat,
      lng: dto.location.location.lng,
    };

    //Se asignan los valores de ejemplo a savedOrder
    const savedOrder: Order = {
      id: 1,
      userId: dto.userId,
      restaurantId: dto.restaurantId,
      products: dto.products,
      locationId: savedLocation.id,
      status: 'pending',
      delivery: false,
      location: savedLocation,
    };
 

      //Esto define que debe devolver cada función simulada
      locationRepo.create.mockReturnValue(savedLocation);
      locationRepo.save.mockResolvedValue(savedLocation);
      orderRepo.create.mockReturnValue(savedOrder);
      orderRepo.save.mockResolvedValue(savedOrder);
      locationRepo.findOneBy.mockResolvedValue(savedLocation);

      //Llamamos y verificamos que llegan los valores esperados
      const result = await service.create(dto);

      expect(locationRepo.create).toHaveBeenCalledWith({
        street: dto.location.street,
        number: dto.location.number,
        cityId: dto.location.cityId,
        lat: dto.location.location.lat,
        lng: dto.location.location.lng,
      });
      expect(orderRepo.create).toHaveBeenCalledWith({
        userId: dto.userId,
        restaurantId: dto.restaurantId,
        products: dto.products,
        locationId: savedLocation.id,
      });
      expect(result).toEqual({
        id: savedOrder.id,
        status: savedOrder.status,
        delivery: savedOrder.delivery,
        location: expect.any(Object),
      });
    });
  });

  //Test FINDONE, simula la búsqueda en BD
  describe('findOne', () => {
    it('debería devolver un pedido por id', async () => {
        //Métodos mockeados que están encadenados para hacer una query a la BD
      const qb: any = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          id: 1,
          status: 'pending',
          delivery: false,
          street: 'Mitre',
          number: '555',
          cityid: 1,
          lat: 10,
          lng: 20,
        }),
      };
      orderRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findOne(1);

      //Lo que se espera
      expect(result).toEqual({
        id: 1,
        status: 'pending',
        delivery: false,
        location: {
          street: 'Mitre',
          number: '555',
          cityId: 1,
          location: { lat: 10, lng: 20 },
        },
      });
    });

    //Caso en que no se encuentre nada
    it('debería lanzar NotFoundException si no existe', async () => {
      const qb: any = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(null),
      };
      orderRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  //Test UPDATE
  describe('update', () => {
    it('debería actualizar el estado del pedido', async () => {
        //Crea un caso ficticio de un pedido
      const order = { id: 1, status: 'pending', locationId: 50 } as Order;
      const location = { id: 50, street: 'X', number: '1', cityId: 1, lat: 1, lng: 2 } as Location;

      orderRepo.findOneBy.mockResolvedValue(order);
      locationRepo.findOneBy.mockResolvedValue(location);
      orderRepo.save.mockResolvedValue({ ...order, status: 'delivered' });

      const result = await service.update(1, { status: 'delivered' });

      //Resultado esperado
      expect(result.status).toBe('delivered');
    });

    //Caso inválido
    it('debería tirar BadRequestException si el status es inválido', async () => {
      const order = { id: 1, status: 'pending', locationId: 50 } as Order;
      const location = { id: 50 } as Location;
      orderRepo.findOneBy.mockResolvedValue(order);
      locationRepo.findOneBy.mockResolvedValue(location);

      await expect(service.update(1, { status: 'otro_estado' })).rejects.toThrow(BadRequestException);
    });
  });

  //Test REMOVE
  describe('remove', () => {

    //Simula que hay un pedido
    it('debería eliminar un pedido con su ubicación', async () => {
      const order = { id: 1, locationId: 99 } as Order;
      const location = { id: 99 } as Location;

      orderRepo.findOneBy.mockResolvedValue(order);
      locationRepo.findOneBy.mockResolvedValue(location);
      orderRepo.remove.mockResolvedValue(order);
      locationRepo.remove.mockResolvedValue(location);

      const result = await service.remove(1);


        //Se espera que se borre el pedido 
      expect(locationRepo.remove).toHaveBeenCalledWith(location);
      expect(orderRepo.remove).toHaveBeenCalledWith(order);
      expect(result).toEqual({ message: 'deleted' });
    });
  });
});