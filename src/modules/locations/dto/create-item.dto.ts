import { IsNotEmpty, IsOptional, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(90)  
  @Min(-90) 
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(180)  
  @Min(-180) 
  lng: number;
}
