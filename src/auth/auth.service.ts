import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { EmailService } from 'src/email/email.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Booking } from 'src/trip/entities/booking.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
     @InjectRepository(Booking)
     private bookingRepository: Repository<Booking>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  async checkEmail(email: string) {
  const user = await this.userRepository
  .createQueryBuilder('user')
  .where('LOWER(user.email) = LOWER(:email)', { email: email })
  .getOne();  
    return {
      exists: !!user,
      message: user ? 'Email already registered' : 'Email available'
    };
  }

  
  async signUp(signUpDto: SignUpDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email: signUpDto.email.toLowerCase() } 
    });
    
    if (existingUser) {
   
      throw new ConflictException('Un compte existe déjà avec cette adresse e-mail');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signUpDto.password, 12);

    // Create user
    const user = this.userRepository.create({
      ...signUpDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const welcomeEmail  =`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Bienvenue sur enjöy !</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Objet : Bienvenue sur enjöy&nbsp;!</h2>

    <p>Bonjour <strong>${user.firstName}</strong>,</p>

    <p>
      Merci de votre inscription. Vous pouvez désormais planifier vos trajets depuis ou vers les aéroports de Paris, en toute sérénité.
    </p>

    <p>
      On s’occupe de tout pour vous offrir un trajet confortable et sans stress.
    </p>

    <p>À bientôt à bord&nbsp;!</p>

    <p style="margin-top: 30px;">
      L'équipe <strong>enjöy</strong>
    </p>
  </body>
</html>
`

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, );
      this.emailService.sendEmail({
        to:user.email, 
        html:welcomeEmail,
        subject:'Bienvenue sur enjöy !'
      })
    return {
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birthYear: user.birthYear,
      },
      accessToken,
    };
  }

  async signIn(signInDto: SignInDto) {
   const user = await this.userRepository
  .createQueryBuilder('user')
  .where('LOWER(user.email) = LOWER(:email)', { email: signInDto.email })
  .getOne();

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
  expiresIn: '7d', // expires in 7 days
});

    return {
      message: 'Connexion réussie',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birthYear: user.birthYear,
      },
      accessToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository
  .createQueryBuilder('user')
  .where('LOWER(user.email) = LOWER(:email)', { email: forgotPasswordDto.email })
  .getOne();

    if (!user) {
      throw new NotFoundException('Aucun compte trouvé avec cette adresse e-mail');
    }

    // Generate reset token and code
    const token = uuidv4();
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset token
    const passwordReset = this.passwordResetRepository.create({
      token,
      code,
      user,
      userId: user.id,
      expiresAt,
    });

    await this.passwordResetRepository.save(passwordReset);
     this.emailService.sendEmail({to:user.email, text:`Use ${code} to reset your password`,subject:`Password reset ${code}`})
    // Here you would send the email with the reset link and code
    // For demo purposes, we're just returning the code
    console.log(`Reset code for ${user.email}: ${code}`);
    console.log(`Reset token: ${token}`);
    return {
      message: 'Un lien de réinitialisation a été envoyé à votre adresse e-mail',
      // In production, don't return these values
      resetToken: token,
      resetCode: code,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { 
        token: resetPasswordDto.token,
        code: resetPasswordDto.code,
        isUsed: false,
      },
      relations: ['user'],
    });

    if (!passwordReset) {
      throw new BadRequestException('Token ou code invalide');
    }

    if (passwordReset.expiresAt < new Date()) {
      throw new BadRequestException('Le lien de réinitialisation a expiré');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);

    // Update user password
    await this.userRepository.update(passwordReset.userId, {
      password: hashedPassword,
    });

    // Mark reset token as used
    await this.passwordResetRepository.update(passwordReset.id, {
      isUsed: true,
    });

    return {
      message: 'Mot de passe réinitialisé avec succès',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
  // Find the user
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('Utilisateur non trouvé');
  }

  // Verify the current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Mot de passe actuel incorrect');
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Update the password
  user.password = hashedNewPassword;
  await this.userRepository.save(user);

  return {
    message: 'Mot de passe mis à jour avec succès',
  };
}

async findAllUsers(page = 1, limit = 10): Promise<{
  data: User[];
  total: number;
  page: number;
  limit: number;
}> {
  const [data, total] = await this.userRepository.findAndCount({
    where:{isAdmin:false},
    order: { createdAt: 'DESC' },
    take: limit,
    skip: (page - 1) * limit,
    select: ['id', 'firstName', 'lastName', 'email', 'phone', 'birthYear', 'isActive'],
  });

  return {
    data,
    total,
    page,
    limit,
  };
}

async suspendUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({where:{ id}});
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return { message:!user.isActive==false? 'Utilisateur suspendu avec succès':'Account activated' };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({where:{ id}});
    if(user){
      await this.bookingRepository.delete({customerId:id})
      await this.userRepository.delete({id});
      return { message: 'Utilisateur supprimé avec succès' };
    }else{
       throw new NotFoundException('Utilisateur non trouvé');
    }
   
 
  }
// src/users/user.service.ts
async updateUser(userId: string, updateUserDto: UpdateUserDto) {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('Utilisateur non trouvé');
  }

  Object.assign(user, updateUserDto);
  await this.userRepository.save(user);

  return {
    message: 'Informations mises à jour avec succès',
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthYear: user.birthYear,
    },
  };
}


}
