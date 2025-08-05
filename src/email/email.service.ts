import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const emailConfig = {
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      // secure: this.configService.get<boolean>('SMTP_SECURE', true),
      requireTLS: this.configService.get<boolean>('SMTP_REQUIRE_TLS', true),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    };
    console.log('Email configuration:', emailConfig);
    this.transporter = nodemailer.createTransport(emailConfig);

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email configuration error:', error);
      } else {
        this.logger.log('Email server is ready to take our messages');
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM'),
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<boolean> {
    const subject = 'Bienvenue sur Enjoý !';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #4F46E5; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0; 
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bienvenue sur Enjoý !</h1>
            </div>
            <div class="content">
              <h2>Salut ${firstName} !</h2>
              <p>Nous sommes ravis de vous accueillir sur Enjoý. Votre compte a été créé avec succès.</p>
              <p>Vous pouvez maintenant profiter de toutes les fonctionnalités de notre plateforme.</p>
              <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
              <p>Bonne découverte !</p>
            </div>
            <div class="footer">
              <p>© 2025 Enjoý. Tous droits réservés.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }

  async sendPasswordResetEmail(
    to: string, 
    firstName: string, 
    resetToken: string, 
    resetCode: string
  ): Promise<boolean> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    const subject = 'Réinitialisation de votre mot de passe - Enjoý';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background-color: #DC2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .code-box { 
              background-color: #1F2937; 
              color: #F3F4F6; 
              padding: 15px; 
              text-align: center; 
              font-size: 24px; 
              font-weight: bold; 
              border-radius: 6px; 
              margin: 20px 0; 
              letter-spacing: 3px;
            }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #DC2626; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0; 
            }
            .warning { 
              background-color: #FEF3C7; 
              border-left: 4px solid #F59E0B; 
              padding: 12px; 
              margin: 20px 0; 
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Réinitialisation du mot de passe</h1>
            </div>
            <div class="content">
              <h2>Salut ${firstName},</h2>
              <p>Vous avez demandé la réinitialisation de votre mot de passe sur Enjoý.</p>
              
              <p><strong>Votre code de vérification :</strong></p>
              <div class="code-box">${resetCode}</div>
              
              <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              </div>
              
              <div class="warning">
                <p><strong>⚠️ Important :</strong></p>
                <ul>
                  <li>Ce lien expire dans <strong>15 minutes</strong></li>
                  <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                  <li>Pour votre sécurité, ne partagez jamais ce code</li>
                </ul>
              </div>
              
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>
            </div>
            <div class="footer">
              <p>© 2025 Enjoý. Tous droits réservés.</p>
              <p>Si vous avez des questions, contactez-nous à support@enjoy.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }

  async sendEmailVerificationEmail(
    to: string, 
    firstName: string, 
    verificationToken: string
  ): Promise<boolean> {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${verificationToken}`;
    const subject = 'Vérifiez votre adresse email - Enjoý';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #059669; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0; 
            }
            .info-box { 
              background-color: #DBEAFE; 
              border-left: 4px solid #3B82F6; 
              padding: 12px; 
              margin: 20px 0; 
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Vérification d'email</h1>
            </div>
            <div class="content">
              <h2>Salut ${firstName} !</h2>
              <p>Merci de vous être inscrit sur Enjoý !</p>
              <p>Pour finaliser la création de votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Vérifier mon email</a>
              </div>
              
              <div class="info-box">
                <p><strong>💡 Pourquoi vérifier votre email ?</strong></p>
                <ul>
                  <li>Sécuriser votre compte</li>
                  <li>Recevoir nos notifications importantes</li>
                  <li>Récupérer votre mot de passe si nécessaire</li>
                </ul>
              </div>
              
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationUrl}</p>
              
              <p>Ce lien expire dans <strong>24 heures</strong>.</p>
            </div>
            <div class="footer">
              <p>© 2025 Enjoý. Tous droits réservés.</p>
              <p>Si vous n'avez pas créé de compte, ignorez cet email</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }
}
