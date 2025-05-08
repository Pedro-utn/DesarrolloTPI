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

  @Column()
  restaurantId: number;

  @Column("int", { array: true })
  products: number[];

  @Column(() => Address)
  location: Address;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'json', nullable: true })
  delivery: any; // Podés usar una clase embebida si sabés su forma
}
