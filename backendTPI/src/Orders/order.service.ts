import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order';
import { Location } from './order';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  private formatOrderResponse(order: Order, location: Location): any {
  return {
    id: order.id,
    status: order.status,
    delivery: order.delivery,
    location: {
      street: location.street,
      number: location.number,
      cityId: location.cityId,
      location: {
        lat: parseFloat(location.lat as any),
        lng: parseFloat(location.lng as any),
      },
    },
  };
}

  async create(orderData: any): Promise<any> {
  const locationData = {
    street: orderData.location.street,
    number: orderData.location.number,
    cityId: orderData.location.cityId,
    lat: orderData.location.location.lat,
    lng: orderData.location.location.lng,
  };

  const location = this.locationRepository.create(locationData);
  const savedLocation = await this.locationRepository.save(location);

  const order = this.orderRepository.create({
    userId: orderData.userId,
    restaurantId: orderData.restaurantId,
    products: orderData.products,
    locationId: savedLocation.id,
  });

  const savedOrder = await this.orderRepository.save(order);

  const fullLocation = await this.locationRepository.findOneBy({ id: savedLocation.id });
  if (!fullLocation) {
    throw new NotFoundException(`Location with ID ${savedLocation.id} not found`);
  }

  return this.formatOrderResponse(savedOrder, fullLocation);
}

  async findAll(page?: number, quantity?: number): Promise<any[]> {
    const itemsPerPage = quantity ? Math.max(1, quantity) : 10;
    const currentPage = page ? Math.max(1, page) : 1;

    const skip = (currentPage - 1) * itemsPerPage;

    console.log(`DEBUG Paginación: Recibido page=${page}, quantity=${quantity}`);
    console.log(`DEBUG Paginación: Calculado currentPage=${currentPage}, itemsPerPage=${itemsPerPage}, skip=${skip}`);
    

    const rows = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('location', 'location', 'order.locationId = location.id')
      .select([
        'order.id AS id',
        'order.status AS status',
        'order.delivery AS delivery',
        'location.street AS street',
        'location.number AS number',
        'location.cityId AS cityId',
        'location.lat AS lat',
        'location.lng AS lng',
      ])
      .offset(skip)
      .limit(itemsPerPage)
      .getRawMany();
  
    return rows.map(row =>
      this.formatOrderResponse(
      {
        id: row.id,
        status: row.status,
        delivery: row.delivery,
      } as Order,
      {
        street: row.street,
        number: row.number,
        cityId: row.cityid,
        lat: row.lat,
        lng: row.lng,
      } as Location
      )
    );
  }
  
  async findOne(id: number): Promise<any> {
    const row = await this.orderRepository 
      .createQueryBuilder('order')
      .leftJoin('location', 'location', 'order.locationId = location.id')
      .select(['order.id AS id', 'order.status AS status', 'order.delivery AS delivery', 'location.street AS street', 'location.number AS number', 'location.cityId AS cityId', 'location.lat AS lat', 'location.lng AS lng',])
      .where('order.id = :id', { id })
      .getRawOne();

    if (!row) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.formatOrderResponse(
      {
        id: row.id,
        status: row.status,
        delivery: row.delivery,
      } as Order,
      {
        street: row.street,
        number: row.number,
        cityId: row.cityid,
        lat: row.lat,
        lng: row.lng,
      } as Location
    );

  }

  async update(id: number, updateData: any): Promise<any> {
    const orderToUpdate = await this.orderRepository.findOneBy({ id: id });
    if (!orderToUpdate) {
      throw new NotFoundException(`Order with ID ${id} not found for update`);
    }
    const locationToUpdate = await this.locationRepository.findOneBy({ id: orderToUpdate.locationId });
    if (!locationToUpdate) {
      throw new NotFoundException(`Location with ID ${orderToUpdate.locationId} not found for order ${id}`);
    }

    const allowedStatuses = ['pending', 'in_progress', 'delivered', 'cancelled']; // <<<--- DEFINE TUS ESTADOS PERMITIDOS AQUÍ (ajusta si son otros)

    if (updateData.status) {
      if (!allowedStatuses.includes(updateData.status)) {
        throw new BadRequestException(`Invalid status: ${updateData.status}. Allowed statuses are: ${allowedStatuses.join(', ')}`);
      }
      orderToUpdate.status = updateData.status;
    }

    if (updateData.location) {
      const locationUpdateData = {
        street: updateData.location.street,
        number: updateData.location.number,
        cityId: updateData.location.cityId,
        lat: updateData.location.location.lat,
        lng: updateData.location.location.lng,
      };
      await this.locationRepository.update(locationToUpdate.id, locationUpdateData);
      Object.assign(locationToUpdate, locationUpdateData);
    }

    const savedOrder = await this.orderRepository.save(orderToUpdate);
    return this.formatOrderResponse(savedOrder, locationToUpdate);
  }

  async updatePartial(id: number, updateData: any): Promise<any> {
    const orderToUpdate = await this.orderRepository.findOneBy({ id: id });
    if (!orderToUpdate) {
      throw new NotFoundException(`Order with ID ${id} not found for partial update`);
    }
    const locationForResponse = await this.locationRepository.findOneBy({ id: orderToUpdate.locationId });
    if (!locationForResponse) {
      throw new NotFoundException(`Location with ID ${orderToUpdate.locationId} not found for order ${id}`);
    }

    const allowedStatuses = ['pending', 'in_progress', 'delivered', 'cancelled']; // <<<--- DEFINE TUS ESTADOS PERMITIDOS AQUÍ (deben ser los mismos que en 'update')

    if (updateData.status) {
      if (!allowedStatuses.includes(updateData.status)) {
        throw new BadRequestException(`Invalid status: ${updateData.status}. Allowed statuses are: ${allowedStatuses.join(', ')}`);
      }
      orderToUpdate.status = updateData.status;
    }

    if (updateData.delivery !== undefined) {
      orderToUpdate.delivery = updateData.delivery;
    }
    if (updateData.id) {
      orderToUpdate.id = updateData.id;
    }

    const savedOrder = await this.orderRepository.save(orderToUpdate);
    return this.formatOrderResponse(savedOrder, locationForResponse);
  }

  async remove(id: number): Promise<{ message: string }> {
    const orderToRemove = await this.orderRepository.findOneBy({ id: id });
    if (!orderToRemove) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (orderToRemove.locationId) {
      const locationToRemove = await this.locationRepository.findOneBy({ id: orderToRemove.locationId });
      if (locationToRemove) {
        await this.locationRepository.remove(locationToRemove);
      }
    }

    await this.orderRepository.remove(orderToRemove);
    return { message: 'deleted' };
  }
}