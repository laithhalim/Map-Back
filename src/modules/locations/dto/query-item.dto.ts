import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';

export class QueryItemDto {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  filterName?: string;

  @IsOptional()
  @IsString()
  filterNotes?: string;
}
