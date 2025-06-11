import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(orderData: any): Promise<Order> {
    // Crear primero la locacion
    const locationData = {
    street: orderData.location.street,
    number: orderData.location.number,
    cityId: orderData.location.cityId,
    lat: orderData.location.coordinates.lat,
    lng: orderData.location.coordinates.lng,
  };


    
    const location = this.locationRepository.create(locationData);
    const savedLocation = await this.locationRepository.save(location);
    
    // Crear la orden con la ubicación
    const order = this.orderRepository.create({
      userId: orderData.userId,
      restaurantId: orderData.restaurantId,
      products: orderData.products,
      locationId: savedLocation.id,
    });
    
    return this.orderRepository.save(order);
  }

  async findAll(): Promise<any[]> {
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
      .getRawMany();
  
    return rows.map(row => ({
      id: row.id,
      status: row.status,
      delivery: row.delivery,
      location: {
        street: row.street,
        number: row.number,
        cityId: row.cityId,
        location: {
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng),
        },
      },
    }));
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

    return {
      id: row.id,
      status: row.status,
      delivery: row.delivery,
      location: {
        street: row.street,
        number: row.number,
        cityId: row.cityId,
        location: {
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng),
        },
      },
    };
  }

  async update(id: number, updateData: any): Promise<Order> {
    const order = await this.findOne(id);
    
    if (updateData.status) {
      order.status = updateData.status;
    }
    
    if (updateData.location) {
      // Actualizar la ubicación existente
      const locationData = {
        street: updateData.location.street,
        number: updateData.location.number,
        cityId: updateData.location.cityId,
        lat: updateData.location.location.lat,
        lng: updateData.location.location.lng,
      };
      
      await this.locationRepository.update(order.locationId, locationData);
    }
    
    return this.orderRepository.save(order);
  }

  async updatePartial(id: number, updateData: any): Promise<Order> {
    const order = await this.findOne(id);
    
    if (updateData.status) {
      order.status = updateData.status;
    }
    
    if (updateData.delivery !== undefined) {
      order.delivery = updateData.delivery;
    }
    if (updateData.id) {
      order.id = updateData.id;
    }
    
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return { message: 'deleted' };
  }
}