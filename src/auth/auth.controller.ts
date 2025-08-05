import { Controller, Post, Body, Get, Query, UseGuards, Request, Patch, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginationQueryDto } from './dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-email')
  @ApiOperation({ summary: 'Check if email exists' })
  @ApiResponse({ status: 200, description: 'Email check result' })
  async checkEmail(@Body() checkEmailDto: CheckEmailDto) {
    return this.authService.checkEmail(checkEmailDto.email);
  }
  @Post('signup')
  @ApiOperation({ summary: 'Create new user account' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    schema: {
      example: {
        user: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@gmail.com",
          phone: "0612345678",
          birthYear: 1990
        }
      }
    }
  
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'Email not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token and code' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid token or code' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return {
      user: req.user,
    };
  }
@Put('/me')
@ApiOperation({ summary: 'Update profile' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
async updateMe(
  @Request() req,
  @Body() updateUserDto: UpdateUserDto
) {
  return this.authService.updateUser(req.user.id, updateUserDto);
}
  @Patch('change-password')
  @ApiOperation({ summary: 'Change password' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async changePassword(
   @Request()req,
  @Body() changePasswordDto: ChangePasswordDto,
) {
  return this.authService.changePassword(
    req.user.id,
    changePasswordDto.currentPassword,
    changePasswordDto.newPassword,
  );
}
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
 @Delete('/delete-account')
  @ApiOperation({ summary: 'For user to delete their account' })
  async deleteAccount(@Request()req) {
    return this.authService.deleteUser(req.user.id);
  }
@Get('admin/users/all')
async getAllUsers(@Query() query: PaginationQueryDto) {
  return this.authService.findAllUsers(query.page, query.limit);
}

@Patch('admin/:id/suspend')
@ApiOperation({ summary: 'For admin to suspend user' })
  async suspendUser(@Param('id') id: string) {
    return this.authService.suspendUser(id);
  }

  @Delete('admin/:id')
  @ApiOperation({ summary: 'For admin to delete user' })
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}