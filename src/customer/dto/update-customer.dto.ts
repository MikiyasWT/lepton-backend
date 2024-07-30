import { IsString, IsEmail } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;
}
