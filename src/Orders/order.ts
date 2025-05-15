import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';


@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  cityId: number;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;


}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  restaurantId: number;

  @Column('int', { array: true })
  products: number[];

  location: Location;

  @Column()
  locationId: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  delivery: number;
}
