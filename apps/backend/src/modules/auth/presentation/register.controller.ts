import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorator';
import { RegisterUserUseCase } from '../application/registerUserUseCase';
import { RegisterRequestDto, type RegisterResponseDto } from './dtos';

@Public()
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {}

  @Post()
  async register(
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.registerUseCase.execute(dto);

    return {
      email: result.email,
      username: result.username,
    };
  }
}
