import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  class Location {
    @Column('float')
    lat: number;
  
    @Column('float')
    lng: number;
  }
  
  class Address {
    @Column()
    street: string;
  
    @Column()
    number: string;
  
    @Column()
    cityId: number;
  
    @Column(() => Location)
    location: Location;
  }
  
  @Entity()
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: number;
  
    // TypeORM no soporta arrays de enteros de forma automática en todos los drivers
    @Column("int", { array: true })
    products: number[];
  
    @Column(() => Address) //Clase Embebida
    location: Address;
  }
  