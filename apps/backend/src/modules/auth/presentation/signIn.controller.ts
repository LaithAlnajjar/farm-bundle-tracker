import { Body, Controller, Post } from '@nestjs/common';
import { SignInUserUseCase } from '../application/signInUserUseCase';
import { SignInRequestDto, type SignInResponseDto } from './dtos';

@Controller('auth/signin')
export class SignInController {
  constructor(private readonly signInUseCase: SignInUserUseCase) {}

  @Post()
  signIn(@Body() dto: SignInRequestDto): Promise<SignInResponseDto> {
    return this.signInUseCase.execute(dto);
  }
}
