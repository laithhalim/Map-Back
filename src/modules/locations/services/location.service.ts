import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '../entities/location.entity';
import { QueryItemDto } from '../dto/query-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { CreateItemDto } from '../dto/create-item.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(dto: CreateItemDto): Promise<Location> {
    try {
      const location = this.locationRepository.create(dto);
      return await this.locationRepository.save(location);
    } catch (error) {
      throw new Error(`Failed to create location: ${error.message}`);
    }
  }

  async findAll(query: QueryItemDto): Promise<{ data: Location[], count: number }> {
    try {
        const { limit, offset, sortBy, sortOrder, filterName, filterNotes } = query;

        const baseQuery = this.locationRepository.createQueryBuilder('location')
            .where('location.isDeleted = :isDeleted', { isDeleted: false });

        if (filterName && filterNotes) {
            baseQuery.andWhere(`location.${filterName} LIKE :filterValue`, { filterValue: `%${filterNotes}%` });
        }

        const count = await baseQuery.getCount();

        if (sortBy) {
            baseQuery.orderBy(`location.${sortBy}`, sortOrder || 'ASC');
        }

        if (limit) {
            baseQuery.limit(limit);
        }
        if (offset) {
            baseQuery.offset(offset);
        }

        const data = await baseQuery.getMany();

        return { data, count };
    } catch (error) {
        throw new Error(`Failed to fetch locations: ${error.message}`);
    }
}

  async update(dto: UpdateItemDto): Promise<any> {
    try {
      if (!dto?.id) {
        throw new Error("ID is required to update a location.");
      }
      await this.locationRepository.update(dto?.id, dto);
      return true;
    } catch (error) {
      throw new Error(`Failed to update location: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.locationRepository.update(id, { isDeleted: true });
    } catch (error) {
      throw new Error(`Failed to delete location: ${error.message}`);
    }
  }
}
