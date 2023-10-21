
import { RoleEnum } from 'src/common/enum/Role-Enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true }) // Default account status: active
  isActive: boolean;

  @Column({ type: 'int', default: RoleEnum.USER }) // Numeric representation from RoleEnum
  userTypeId: number;

  @Column({ type: 'varchar', default: RoleEnum[RoleEnum.USER] }) // String representation from RoleEnum
  role: string;

  @Column({ nullable: true }) // Optional field
  email: string;

  @Column({ nullable: true }) // Optional field
  phoneNumber: string;

  @Column({ nullable: true }) // Optional field
  age: number;

  @Column({ nullable: true }) // Optional field
  address: string;

  @Column({ nullable: true }) // Optional field
  country: string;

  @Column({ nullable: true }) // Optional field
  city: string;

  @Column({ nullable: true }) // Optional field
  postalCode: string;

  @Column({ nullable: true }) 
  profilePictureUrl: string; 

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  refreshToken: string;

}
