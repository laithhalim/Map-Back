import { Controller, Get, Post, Put, Delete, Body, Query, Param, BadRequestException } from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { CustomResponse } from 'src/utils/custom-response';
import { BulkCreateLocationsDto } from '../dto/bulk-create-locations.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(@Body() dto: CreateItemDto): Promise<any> {
    try {
      await this.locationService.create(dto);
      return CustomResponse.success(true, 'Location created successfully');
    } catch (err) {
      throw new BadRequestException(CustomResponse.error('Failed to create location', 404));
    }
  }

  @Get()
  async findAll(@Query() query): Promise<any> {
    try {
      const locations = await this.locationService.findAll(JSON.parse(query.params));
      return CustomResponse.success(locations, 'Locations fetched successfully');
    } catch (err) {
      throw new BadRequestException(CustomResponse.error('Failed to fetch locations', 404));
    }

  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateItemDto): Promise<any> {
    try {
      dto.id = id;
      await this.locationService.update(dto);
      return CustomResponse.success(true, 'Location updated successfully');
    } catch (err) {
      throw new BadRequestException(CustomResponse.error('Failed to update location', 404));
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    try {
      await this.locationService.delete(id);
      return CustomResponse.success(true, 'Location deleted successfully');
    } catch (err) {
      throw new BadRequestException(CustomResponse.error('Failed to delete location', 404) );
    }
  }

  @Post('bulk-insert')
  async bulkInsertLocations(@Body() bulkLocationsDto: BulkCreateLocationsDto): Promise<any> {
    try {
      await this.locationService.createMultipleLocations(bulkLocationsDto.locations);
      return CustomResponse.success(true, 'Locations created successfully');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(CustomResponse.error('Failed to create locations', 404));
    }
  }

  @Get('delete-all')
  async removeAll(): Promise<any> {
    try {
      await this.locationService.softDeleteAll();
      return CustomResponse.success(true, 'All locations marked as deleted successfully');
    } catch (err) {
      throw new BadRequestException(CustomResponse.error('Failed to mark all locations as deleted', 404));
    }
  }


}

