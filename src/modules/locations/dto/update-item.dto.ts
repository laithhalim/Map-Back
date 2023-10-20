import { IsNotEmpty, IsOptional, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class UpdateItemDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500) 
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Max(90)  
  @Min(-90)
  lat?: number;

  @IsOptional()
  @IsNumber()
  @Max(180)  
  @Min(-180)
  lng?: number;
}
