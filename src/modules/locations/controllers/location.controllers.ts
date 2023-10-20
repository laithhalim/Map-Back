import { Controller, Get, Post, Put, Delete, Body, Query, Param, BadRequestException } from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { CustomResponse } from 'src/utils/custom-response';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(@Body() dto: CreateItemDto): Promise<any> {
    try {
      await this.locationService.create(dto);
      return CustomResponse.success(true, 'Location created successfully');
    } catch (err) {
      throw new BadRequestException('Failed to create location');
    }
  }

  @Get()
  async findAll(@Query() query): Promise<any> {
    try {
      const locations = await this.locationService.findAll(JSON.parse(query.params));
      return CustomResponse.success(locations, 'Locations fetched successfully');
    } catch (err) {
      throw new BadRequestException('Failed to fetch locations');
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateItemDto): Promise<any> {
    try {
      dto.id = id;
      await this.locationService.update(dto);
      return CustomResponse.success(true, 'Location updated successfully');
    } catch (err) {
      throw new BadRequestException('Failed to update location');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    try {
      await this.locationService.delete(id);
      return CustomResponse.success(true, 'Location deleted successfully');
    } catch (err) {
      throw new BadRequestException('Failed to delete location');
    }
  }
}
