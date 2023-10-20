import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  notes?: string;

  @Column('double precision')
  lat: number;

  @Column('double precision')
  lng: number;

  @Column({ default: false })
  isDeleted: boolean;
}
