import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards,Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateBookingDto } from "./dto/bookings.dto";
import { Booking } from "./entities/booking.entity";
import { BookingService } from "./trip.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { SearchBookingDto } from "./dto/search.dto";
import { CancelBookingRequestDto, HandleCancellationDto } from "./dto/cancellation.dto";
import { SendRideDetailsDto } from "./dto/send-ride-details.dto";
@ApiTags('Bookings')
@Controller('bookings')
export class TripBookingController {
    constructor(
     private readonly bookingService: BookingService
    ){
   
    }
   @Post()
   @ApiBearerAuth()
@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: Booking,
    example: {
      success: true,
      message: 'Booking created successfully',
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tripDateTime: '2024-01-24T16:00:00Z',
        passengers: 4,
        bags: 4,
        childSeat: false,
        pets: false,
        wheelchair: false,
        boosterSeat: false,
        driverLanguage: 'fr',
        welcomeSign: false,
        flightNumber: null,
        totalPrice: 100.00,
        languageFee: 0.00,
        welcomeSignFee: 0.00,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: '2024-01-24T10:00:00Z',
        updatedAt: '2024-01-24T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Location or vehicle not found' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.create(createBookingDto);
  }

   @Get('/:bookingId/details')
   @ApiBearerAuth()
@UseGuards(JwtAuthGuard)
     @ApiOperation({ summary: 'Call endpoint to get a booking details' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: Booking,
    example: {
      success: true,
      message: 'Booking created successfully',
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tripDateTime: '2024-01-24T16:00:00Z',
        passengers: 4,
        bags: 4,
        childSeat: 0,
        pets: 0,
        wheelchair: 0,
        boosterSeat: 0,
        driverLanguage: 'fr',
        welcomeSign: 0,
        flightNumber: null,
        totalPrice: 100.00,
        languageFee: 0.00,
        welcomeSignFee: 0.00,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: '2024-01-24T10:00:00Z',
        updatedAt: '2024-01-24T10:00:00Z',
      },
    },
  })
   async getBookingDetails(@Param('bookingId')bookingId:string){
    return await this.bookingService.findOne(bookingId);

   }

    @Patch('admin/:bookingId/complete')
     async markTripAsCompleted(@Param('bookingId')bookingId:string){
    return await this.bookingService.markTripAsCompleted(bookingId);
   }

@Get('admin/all')
async findAllBooking(@Query()dto:SearchBookingDto){
    return await this.bookingService.findAll(dto)
}

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
// @Get('/history')
// async findTripHistory(   @Request()req,@Query()dto:SearchBookingDto,){
//   console.log(req.user)
//     return await this.bookingService.usertripHistory(dto,     req.user.id,)
// }
@Get('/history')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
async findTripHistory(
  @Request() req,
  @Query() dto: SearchBookingDto,
) {
  return this.bookingService.usertripHistory(dto, req.user.id);
}


  @Patch('/:bookingId')
   @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Call endpoint once payment is succeeded' })
  @ApiResponse({
    status: 201,
    description: 'Booking successfully paid',
    type: Booking,
    example: {
      success: true,
      message: 'Booking created successfully',
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tripDateTime: '2024-01-24T16:00:00Z',
        passengers: 4,
        bags: 4,
        childSeat: 0,
        pets: 0,
        wheelchair: 0,
        boosterSeat: 0,
        driverLanguage: 'fr',
        welcomeSign: 0,
        flightNumber: null,
        totalPrice: 100.00,
        languageFee: 0.00,
        welcomeSignFee: 0.00,
        status: 'pending',
        paymentStatus: 'completed',
        createdAt: '2024-01-24T10:00:00Z',
        updatedAt: '2024-01-24T10:00:00Z',
      },
    },
  })
async completePayment(@Param('bookingId')bookingId:string){
 return this.bookingService.completePayment(bookingId)
}
@ApiOperation({ summary: 'Call endpoint once payment failed' })
@Post(':bookingId/payment-fail')
async paymentFailure(@Param('bookingId')bookingId:string){
 return this.bookingService.completePayment(bookingId)
}

@Post('/:bookingId/cancel-request')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
async requestCancel(
  @Param('bookingId') bookingId: string,
  @Request() req,
  @Body() dto: CancelBookingRequestDto,
) {
  return this.bookingService.requestCancellation(bookingId, req.user.id, dto);
}

@Post('/admin/:bookingId/handle-cancellation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
async handleCancel(
  @Param('bookingId') bookingId: string,
  @Body() dto: HandleCancellationDto,
) {
  return this.bookingService.handleCancellation(bookingId, dto);
}

@Post('/admin/send-email')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
async sendEmail(
  @Body() dto: SendRideDetailsDto,
) {
  return this.bookingService.sendRideDetails(dto);
}

}