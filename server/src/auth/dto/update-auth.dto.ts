import { PartialType } from '@nestjs/mapped-types';
import { SignupAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(SignupAuthDto) {}
