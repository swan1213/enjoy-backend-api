import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateBookingDto } from "./dto/bookings.dto";
import { startOfDay } from 'date-fns';
import { Booking } from "./entities/booking.entity";
import Stripe from 'stripe';
import { BookingStatus, CancellationStatus, PaymentMethod, PaymentStatus } from "src/common/enum";
import { config } from 'dotenv';
import { User } from "src/auth/entities/user.entity";
import { SearchBookingDto } from "./dto/search.dto";
import { CancelBookingRequestDto, HandleCancellationDto } from "./dto/cancellation.dto";
import { EmailService } from "src/email/email.service";
import { SendRideDetailsDto } from "./dto/send-ride-details.dto";


config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
     private userRepository: Repository<User>,
     private readonly emailService:EmailService
  ) {}
  // onModuleInit() {
  //   this.bookingRepository.deleteAll()
  // }



async create(createBookingDto: CreateBookingDto,): Promise<{ booking: Booking; clientSecret?: string }> {
  try {
    const {
      totalPrice,
      languageFee,
      welcomeSignFee,
      paymentMethod,
      customerId,
      departAddress,
      destinationAddress,
      vehicleType,
      boosterSeat,
      flightNumber,
      bags,
      time,
      driverLanguage,
      passengers,
      wheelchair,
      pets,
      strollers,
      childSeat,
    } = createBookingDto;
    const user = await this.userRepository.findOne({where:{id:customerId}});
    if (!user) {
     throw new NotFoundException('User not found');
    }
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      tripDateTime: new Date(createBookingDto.tripDateTime),
      totalPrice,
      languageFee,
      welcomeSignFee,
      paymentStatus: paymentMethod === PaymentMethod.CARD ? PaymentStatus.PENDING : PaymentStatus.PAID,
    },);

    const savedBooking = await this.bookingRepository.save(booking);
    const bookingCustomer = await this.bookingRepository.findOne({where:{bookingId:savedBooking.bookingId}, relations:['customer']})
     const firstName = bookingCustomer.customer.firstName;
     const date = savedBooking.tripDateTime;
     const phone = bookingCustomer.customer.phone;
     const email = bookingCustomer.customer.email;
    const userEmail =`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Votre réservation enjöy est confirmée ✅</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Objet : Votre réservation enjöy est confirmée ✅</h2>

    <p>Bonjour <strong>${firstName}</strong>,</p>

    <p>Votre réservation a bien été enregistrée.</p>

    <p><strong>Date :</strong> ${date}<br />
       <strong>Heure :</strong> ${time}<br />
       <strong>Trajet :</strong> ${departAddress} → ${destinationAddress}<br />
       <strong>Nombre de passagers :</strong> ${passengers}<br />
       <strong>Bagages :</strong> ${bags} – <strong>Poussettes :</strong> ${strollers} – <strong>Animaux :</strong> ${pets}<br />
       <strong>Fauteuil roulant :</strong> ${wheelchair}<br />
       <strong>Siège auto :</strong> ${childSeat} – <strong>Réhausseur :</strong> ${boosterSeat}<br />
       <strong>Véhicule choisi :</strong> ${vehicleType}<br />
       <strong>Options :</strong> ${driverLanguage}<br />
       <strong>Chauffeur :</strong> informations à venir
    </p>

    <h3>Paiement :</h3>
    <p>
      <strong>Méthode :</strong> ${paymentMethod==PaymentMethod.CARD?'Carte':'Sur place'}<br />
      <strong>Montant :</strong> ${totalPrice} €
    </p>

    <p>Vous recevrez un e-mail bientôt avec toutes les informations de votre chauffeur.</p>

    <p>Merci pour votre confiance.</p>

    <p style="margin-top: 30px;">L'équipe <strong>enjöy</strong></p>
  </body>
</html>
`

    const adminEmail=`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Nouvelle réservation de trajet</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Une nouvelle réservation a été effectuée.</p>

    <h3>Détails du trajet :</h3>

    <p><strong>Client :</strong><br />
      Nom : ${firstName}<br />
      Téléphone : ${phone}<br />
      E-mail : ${email}
    </p>

    <p><strong>Trajet :</strong><br />
      Départ : ${departAddress}<br />
      Destination : ${destinationAddress}<br />
      Date & heure : ${date} à ${time}<br />
      Vol : ${flightNumber}<br />
      Nombre de passagers : ${passengers}<br />
      Bagages : ${bags} – Poussettes : ${strollers} – Animaux : ${pets}<br />
      Fauteuil roulant : ${wheelchair}<br />
      Siège auto : ${childSeat} – Réhausseur : ${boosterSeat}<br />
      Véhicule choisi : ${vehicleType}<br />
      Options : ${driverLanguage}
    </p>

    <p><strong>Paiement :</strong><br />
      Méthode : ${paymentMethod}<br />
      Montant : ${totalPrice} €
    </p>

  
  </body>
</html>
`

    let clientSecret: string | undefined;

    if (paymentMethod === PaymentMethod.CARD) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(totalPrice) * 100), // Stripe expects amount in the smallest currency unit
        currency: 'eur', // or 'usd', or your currency
        receipt_email: user.email,
        metadata: {
          bookingId: savedBooking.bookingId,
        },
      });

      clientSecret = paymentIntent.client_secret;
    }
    this.emailService.sendEmail({
      to:bookingCustomer.customer.email,
      subject:`Votre réservation enjöy est confirmée ✅`,
      html:userEmail
    });
     this.emailService.sendEmail({
      to:process.env.ADMIN_EMAIL,
      subject:`Nouvelle réservation de trajet-${firstName} – ${date} à ${time}`,
      html:adminEmail
    })
    return { booking: savedBooking, clientSecret };
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('Booking creation failed');
  }

}

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { bookingId: id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async completePayment(bookingId:string){
    try {
        const booking = await this.bookingRepository.findOne({where:{ bookingId}, relations:['customer']});

        if (!booking) {
            throw new NotFoundException('No booking found with provided id')
        }
        const {firstName} =booking.customer
        const paymentSuccessEmail =`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Paiement confirmé – votre trajet est prêt</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Objet : Paiement confirmé – votre trajet est prêt</h2>

    <p>Bonjour <strong>${firstName}</strong>,</p>

    <p>
      Nous avons bien reçu votre paiement pour le trajet du 
      <strong>${booking.tripDateTime}</strong> à <strong>${booking.time}</strong>.
    </p>

    <p>
      Merci de votre confiance.<br />
      Vous recevrez bientôt les détails de votre chauffeur.
    </p>

    <p>À bientôt à bord !</p>

    <p style="margin-top: 30px;">
      L'équipe <strong>enjöy</strong>
    </p>
  </body>
</html>
`
this.emailService.sendEmail({
  to:booking.customer.email,
  subject:`Paiement confirmé – votre trajet est prêt`,
  html: paymentSuccessEmail
})
      return await this.bookingRepository.update({bookingId}, {paymentStatus:PaymentStatus.PAID});
    } catch (error) {
       throw new InternalServerErrorException('An error occured', error);  
    }
  }

   async PaymentFailureNotification(bookingId:string){
    try {
      
        const booking = await this.bookingRepository.findOne({where:{ bookingId}, relations:['customer']});
        if (!booking) {
            throw new NotFoundException('No booking found with provided id')
        }
        const {totalPrice, tripDateTime, departAddress,time,destinationAddress}= booking;
        const {firstName, } = booking.customer
  const adminEmail =`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Échec de paiement – ${firstName} – Trajet du ${tripDateTime} à ${time}</title>
  </head>
  <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">

    <p>Un paiement n’a pas été validé pour le trajet suivant :</p>

    <h3>Client :</h3>
    <p>
      Nom : ${firstName}<br />
      E-mail : ${booking.customer.email}<br />
      Téléphone : ${booking.customer.phone}
    </p>

    <h3>Trajet :</h3>
    <p>
      Départ : ${departAddress}<br />
      Destination : ${destinationAddress}<br />
      Date & heure : ${tripDateTime} à ${time}<br />
      Montant à régler : ${totalPrice} €
    </p>

  
  </body>
</html>
`

const emailUser= `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Paiement échoué – action requise</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Objet : Paiement échoué – action requise</h2>

    <p>Bonjour <strong>${firstName}</strong>,</p>

    <p>
      Votre tentative de paiement pour le trajet du <strong>${booking.tripDateTime}</strong> a échoué.<br />
      Merci de vérifier vos informations bancaires et de réessayer depuis l’application.
    </p>

    <p>
      Sans validation du paiement, la réservation ne sera pas confirmée.
    </p>

    <p>
      Merci pour votre compréhension.
    </p>

    <p style="margin-top: 30px;">
      L'équipe <strong>enjöy</strong>
    </p>
  </body>
</html>
`;
        
        this.emailService.sendEmail({
          to:process.env.ADMIN_EMAIL,
          html:adminEmail,
          subject:`Échec de paiement – ${firstName} – Trajet du ${booking.tripDateTime} à ${booking.time}`
        })

        this.emailService.sendEmail({
          to:booking.customer.email,
          html:emailUser,
          subject:`Paiement échoué – action requise`
        })

      return {message:'Admin has been notified of the payment failure'}
    } catch (error) {
       throw new InternalServerErrorException('An error occured', error);  
    }
  }

 async handleCancellation(bookingId: string, dto: HandleCancellationDto) {
  const booking = await this.bookingRepository.findOne({
    where: { bookingId },
    relations:['customer']
  });

  if (!booking || booking.cancellationStatus !== CancellationStatus.REQUESTED) {
    throw new BadRequestException('No cancellation request pending');
  }
  const firstName = booking.customer.firstName;
  const time = booking.time;
  let sentEmail=``;
  const date = booking.tripDateTime;
  if (dto.action === 'REJECT') {
    booking.cancellationStatus = CancellationStatus.REJECTED;
    await this.bookingRepository.save(booking);

    // Send rejection email to user
    sentEmail = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Demande d'annulation refusée</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Objet : Demande d’annulation refusée</h2>

    <p>Bonjour <strong>${firstName}</strong>,</p>

    <p>
      Nous avons bien reçu votre demande d’annulation pour le trajet prévu le
      <strong>${date}</strong> à <strong>${time}</strong>.<br />
      Après vérification, celle-ci n’a pas pu être acceptée, et votre réservation reste donc confirmée.
    </p>

    <p><strong>Motif du refus communiqué par notre équipe :</strong><br />
      ${dto.rejectionOrApprovalComments}
    </p>

    <p>
      Nous restons disponibles si vous avez la moindre question.<br />
      Merci pour votre compréhension.
    </p>

    <p style="margin-top: 30px;">
      L’équipe <strong>enjöy</strong>
    </p>
  </body>
</html>
`
    await this.emailService.sendEmail({
      to: booking.customer.email,
      subject:dto.action!='REJECT'? 'Annulation acceptée par notre équipe':'Demande d\'annulation refusée',
      html: sentEmail,
    });

    return { message: 'Cancellation rejected' };
  }else{
    sentEmail =`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Annulation acceptée</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Objet : Annulation acceptée par notre équipe</h2>

    <p>Bonjour <strong>${firstName}</strong>,</p>

    <p>
      Votre trajet prévu le <strong>${date}</strong> a été annulé avec succès.<br />
      Selon les conditions de votre réservation, des frais ont pu être retenus.<br />
      Vous recevrez un récapitulatif sous peu.
    </p>

    <p>À très vite,</p>

    <p style="margin-top: 30px;">
      L'équipe <strong>enjöy</strong>
    </p>
  </body>
</html>
`
  }

  // Approve logic
  booking.cancellationStatus = CancellationStatus.APPROVED;

  const tripDateTime = new Date(booking.tripDateTime);
  const now = new Date();
  const hoursBeforeTrip = (tripDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  let refundAmount = 0;
  if (hoursBeforeTrip >= 48) {
    refundAmount = booking.totalPrice;
  } else if (dto.refundAmount != null) {
    refundAmount = dto.refundAmount;
  }

  booking.refundedAmount = refundAmount;

  if (booking.paymentStatus === PaymentStatus.COMPLETED && refundAmount > 0) {
    // const paymentIntentId = await this.getPaymentIntentIdForBooking(booking.bookingId);
    // await stripe.refunds.create({
    //   payment_intent: paymentIntentId,
    //   amount: Math.round(refundAmount * 100),
    // });
  }

  await this.bookingRepository.save(booking);

  // Send approval email to user
  await this.emailService.sendEmail({
    to: booking.customer.email,
    subject: 'Booking Cancellation Approved',
    text: `Your cancellation for booking ID ${booking.bookingId} has been approved.\nRefund Amount: €${refundAmount}`,
  });

  return {
    message: 'Cancellation approved',
    refundAmount,
  };
}

async usertripHistory(searchDto: SearchBookingDto, customerId:string) {
    try {
          const { page = 1, limit = 10, } = searchDto;
          const today = startOfDay(new Date());
  const [data, total] = await this.bookingRepository
    .createQueryBuilder('booking')
    .leftJoinAndSelect('booking.customer', 'customer')
    .addSelect(`
      CASE 
        WHEN booking.tripDateTime >= :today THEN 0
        ELSE 1
      END
    `, 'priority_order')
    .where('customer.id = :customerId', { customerId })
    .orderBy('priority_order', 'ASC') // future trips first
    .addOrderBy('booking.tripDateTime', 'ASC') // then by trip date/time
    .setParameter('today', today.toISOString()) // PostgreSQL ISO format
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
  return {
    data,
    total,
    page,
    limit,
  };
    } catch (error) {
     throw new InternalServerErrorException(error.message)  
    }
   
  }




async findAll(searchDto: SearchBookingDto) {
    const { page = 1, limit = 10, } = searchDto;
      const today = startOfDay(new Date());
   const [data, total] = await this.bookingRepository
    .createQueryBuilder('booking')
    .leftJoinAndSelect('booking.customer', 'customer')
    .addSelect(`
      CASE 
        WHEN booking.tripDateTime >= :today THEN 0
        ELSE 1
      END
    `, 'priority_order')
    .orderBy('priority_order', 'ASC') // future trips first
    .addOrderBy('booking.tripDateTime', 'ASC') // then by trip date/time
    .setParameter('today', today.toISOString()) // PostgreSQL ISO format
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
  return {
    data,
    total,
    page,
    limit,
  };
  
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }

async requestCancellation(bookingId: string, userId: string, dto: CancelBookingRequestDto) {
  const booking = await this.bookingRepository.findOne({ where: { bookingId }, relations:['customer'] });

  if (!booking) {
    throw new NotFoundException('Booking not found or not owned by user');
  }

  if (booking.cancellationStatus !== CancellationStatus.NONE) {
    throw new BadRequestException('Cancellation already requested or processed');
  }

const now = new Date();
const tripDateTime = new Date(booking.tripDateTime);
const diffInMs = tripDateTime.getTime() - now.getTime(); 
const diffInHours = diffInMs / (1000 * 60 * 60);
const firstName = booking.customer.firstName
    const date= booking.tripDateTime;
    const time = booking.time;
    const customerEmail = booking.customer.email;
    const phoneNumber = booking.customer.phone;
    const {
      departAddress, 
      flightNumber,
      bags,
      childSeat,
      destinationAddress, 
      strollers, 
      boosterSeat,
       pets,
    
      passengers,
      vehicleType,
      paymentMethod,
      totalPrice, 
      wheelchair} =booking;
const requiresAdminApproval= diffInHours > 48;
  await this.bookingRepository.update(
    { bookingId },
    {
      cancellationStatus: requiresAdminApproval ? CancellationStatus.APPROVED : CancellationStatus.REQUESTED,
      status:requiresAdminApproval? BookingStatus.PENDING: BookingStatus.CANCELLED,
      cancellationReason: dto.reason,
      refundedAmount:requiresAdminApproval? Number(booking.totalPrice):0,
      cancellationRequestedAt: now,
    },
  );
  let userEmail ='';

  if(!requiresAdminApproval){
    
    userEmail =`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Annulation de votre trajet</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Bonjour <strong>${firstName}</strong>,</p>

    <p>
      Votre trajet prévu le <strong>${date}</strong> à <strong>${time}</strong> a bien été annulé.<br />
      Conformément à nos conditions, <strong>aucun frais ne vous sera facturé</strong>.
    </p>

    <p>Au plaisir de vous accompagner une prochaine fois !</p>

    <p style="margin-top: 30px;">
      L'équipe <strong>enjöy</strong>
    </p>
  </body>
</html>
`
  }else{
    userEmail =`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Demande d'annulation</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Bonjour <strong>${firstName}</strong>,</p>

    <p>
      Vous avez demandé l’annulation de votre trajet prévu le <strong>${date}</strong> à <strong>${time}</strong>.<br />
      Cette annulation intervient à moins de 48h du départ, et peut entraîner des frais.
    </p>

    <p>
      Notre équipe étudiera votre demande et vous tiendra informé rapidement.
    </p>

    <p style="margin-top: 30px;">
      L'équipe <strong>enjöy</strong>
    </p>
  </body>
</html>
`
  }
  this.emailService.sendEmail({
    subject:requiresAdminApproval?' Votre demande d’annulation est en cours de traitement':'Annulation confirmée – aucun frais retenu',
    to: booking.customer.email,
    html: userEmail,
  })

  const adminEmail = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Nouvelle réservation de trajet</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2c3e50;">
      Nouvelle réservation de trajet – ${firstName} – ${date} à ${time}
    </h2>

    <p>Une nouvelle réservation a été effectuée.</p>

    <h3>Détails du trajet :</h3>

    <p><strong>Client :</strong><br />
      Nom : ${firstName}<br />
      Téléphone : ${phoneNumber}<br />
      E-mail : ${customerEmail}
    </p>

    <p><strong>Trajet :</strong><br />
      Départ : ${departAddress}<br />
      Destination : ${destinationAddress}<br />
      Date & heure : ${date} à ${time}<br />
      Vol : ${flightNumber}<br />
      Nombre de passagers : ${passengers}<br />
      Bagages : ${bags} – Poussettes : ${strollers} – Animaux : ${pets}<br />
      Fauteuil roulant : ${wheelchair}<br />
      Siège auto : ${childSeat} – Réhausseur : ${boosterSeat}<br />
      Véhicule choisi : ${vehicleType}<br />
    </p>

    <p><strong>Paiement :</strong><br />
      Méthode : ${paymentMethod}<br />
      Montant : ${totalPrice} €
    </p>

  
  </body>
</html>
`
await this.emailService.sendEmail({
  to:process.env.ADMIN_EMAIL,
  html: adminEmail,
  subject:` Demande d’annulation-${firstName}-Trajet du ${date} à ${time}
`
})
  return {
    message: requiresAdminApproval
      ? 'Cancellation request submitted for manual review (partial or no refund)'
      : 'Cancellation approved',
  };
}


async sendRideDetails(dto:SendRideDetailsDto){
  try {
    await this.emailService.sendEmail({
      subject:dto.subject??`Ride Confirmation and details`,
      to:dto.email,
      text:dto.message
    })
  } catch (error) {
    throw new InternalServerErrorException('An error occured')
  }
}

async markTripAsCompleted(bookingId:string){
  try {
     const booking = await this.bookingRepository.findOne({ where: { bookingId }, relations:['customer'] });

  if (!booking) {
    throw new NotFoundException('Booking not found or not owned by user');
  }
   return await this.bookingRepository.update({bookingId}, {status: BookingStatus.COMPLETED}) 
  } catch (error) {
   throw new InternalServerErrorException('Failed to update booking data', error);

  }
}

}