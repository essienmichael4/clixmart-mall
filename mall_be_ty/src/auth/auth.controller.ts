import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgottenPasswordDto, UserSignUpDto } from './dto/register.dto';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgottenPasswordResponse, LoginReponse, RefreshTokenDto, UserAuthReponse } from './dto/response.dto';
import { UserSignInDto } from './dto/signin.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { RefreshJwtGuard } from 'src/guards/refresh.guard';

@Controller('auth')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: UserAuthReponse, description: "User created successfully"})
  @ApiOkResponse({type: UserAuthReponse, description: "User created successfully"})
  @ApiOperation({description: "Register user api"})
  @ApiConsumes("application/json")
  @Post("signup")
  async signup(@Body() body:UserSignUpDto){
    try{
      return this.authService.register(body);
    }catch(err){
      throw err
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: LoginReponse, description: ""})
  @ApiOperation({description: "Login user api"})
  @ApiConsumes("application/json")
  @Post("signin")
  async signin(@Body() body:UserSignInDto){
    return await this.authService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: RefreshTokenDto, description: ""})
  @ApiOperation({description: "Refresh user access token api"})
  @ApiConsumes("application/json")
  @UseGuards(RefreshJwtGuard)
  @Get("refresh")
  async refreshToken(@User() req:UserInfo){
    const accessToken =  {accessToken: await this.authService.resignAuthPayload(req)}
    
    return accessToken
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: ForgottenPasswordResponse, description: ""})
  @ApiOperation({description: "Forgot password api"})
  @ApiConsumes("application/json")
  @Get("forgot-password")
  async forgottenPassword(@Body() body:ForgottenPasswordDto){
    try{
      return this.authService.forgotPassword(body)
    }catch(err){
      throw err
    }
  }
}
