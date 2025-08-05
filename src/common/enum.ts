export enum LocationTypes {
  AIRPORT = 'airport',
  HOTEL = 'hotel',
  STATION = 'station',
  CUSTOM = 'custom',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  COMPLETED='completed'
}

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
}

export enum Languages {
  FRENCH = 'fr',
  ENGLISH = 'en',
  SPANISH = 'es',
  PORTUGUESE='pt',
  ARABIC='ar',
  GERMANY='de',
  ITALIAN='it',
  CHINESE='zh'
}

export enum VehicleTypes {
  SEDAN = 'sedan',
  VAN = 'van',
  BERLINE='berline'

}

export enum CancellationStatus {
  NONE = 'NONE',
  REQUESTED = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}