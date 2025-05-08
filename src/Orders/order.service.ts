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
      lat: orderData.location.location.lat,
      lng: orderData.location.location.lng,
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

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
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
    
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return { message: 'deleted' };
  }
}