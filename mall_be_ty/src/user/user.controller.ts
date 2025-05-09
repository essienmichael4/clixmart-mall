import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus, ParseIntPipe, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AddressDto, CreateUserDto, FindUsersDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordRequest, UpdateUserRequest } from './dto/update-user.dto';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/userResponse.dto';
// import { User } from './entities/user.entity';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('users')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: UserResponseDto, description: "User created successfully"})
  @ApiOkResponse({type: UserResponseDto, description: "User created successfully"})
  @ApiOperation({description: "Create user api"})
  @ApiConsumes("application/json")
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({type: UserResponseDto, description: "User address updated successfully"})
  @ApiOkResponse({type: UserResponseDto, description: "User address updated successfully"})
  @ApiOperation({description: "Add user address api"})
  @ApiConsumes("application/json")
  @Post(":id/address")
  addAddress(@Body() addressDto: AddressDto, @User() user:UserInfo) {
    return this.userService.addAddress(user.sub.id, addressDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  // @ApiCreatedResponse({type: UserResponseDto, description: "Find users based on props"})
  @ApiOkResponse({type: UserResponseDto, description: ""})
  @ApiOperation({description: "Find users based on props"})
  @ApiConsumes("application/json")
  @Get()
  findUsers(@Body() filters: FindUsersDto) {
    return this.userService.findUsersByFilters(filters);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: UserResponseDto, description: ""})
  @ApiOperation({description: "Find user by ID"})
  @ApiConsumes("application/json")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserRequest, @User() user:UserInfo) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Patch('password/:id')
  async updatePassword(@Param('id', ParseIntPipe) id: number, @Body() updateUserPasswordRequest: UpdateUserPasswordRequest, @User() user:UserInfo) {
    try{
      if(id !== user.sub.id) throw new UnauthorizedException()
    
      const updated = await this.userService.updateUserPassword(id, updateUserPasswordRequest)
      const {password, ...result} = updated
  
      return {user: result ,message: "User password updated successfully"}
    }catch(err){
      throw err
    }

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
