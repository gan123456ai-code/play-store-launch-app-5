// ============================================================================
// TravelBank Ultra - Type Definitions
// Complete TypeScript interfaces for the entire application
// ============================================================================

// ============================================================================
// COMMON TYPES
// ============================================================================

export type AppMode = 'travel' | 'banking';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceElevated: string;
  surfacePressed: string;
  card: string;
  cardElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderLight: string;
  divider: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  shadow: string;
  overlay: string;
  shimmer: string;
  gradient1Start: string;
  gradient1End: string;
  gradient2Start: string;
  gradient2End: string;
  gradient3Start: string;
  gradient3End: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  statusBarStyle: 'light' | 'dark';
  glassBg: string;
  glassBorder: string;
  neumorphLight: string;
  neumorphDark: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    h4: TextStyle;
    body: TextStyle;
    bodySmall: TextStyle;
    caption: TextStyle;
    button: TextStyle;
    label: TextStyle;
  };
}

export interface TextStyle {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing?: number;
}

export interface AnimationConfig {
  duration: number;
  damping: number;
  stiffness: number;
  mass: number;
}

export interface ToastConfig {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export interface BottomSheetAction {
  id: string;
  icon: string;
  label: string;
  subtitle?: string;
  color?: string;
  destructive?: boolean;
  onPress: () => void;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface UserPreferences {
  theme: ThemeMode;
  appMode: AppMode;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  currency: string;
  language: string;
  recentSearches: string[];
  favoriteFlights: string[];
  favoriteHotels: string[];
  savedPayees: string[];
}

export interface StorageKeys {
  PREFERENCES: string;
  FAVORITES: string;
  HISTORY: string;
  BOOKINGS: string;
  TRANSACTIONS: string;
  CARDS: string;
  BILLS: string;
  INVESTMENTS: string;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export type TravelTabParamList = {
  FlightsTab: undefined;
  HotelsTab: undefined;
  TrainsTab: undefined;
  BookingsTab: undefined;
  SettingsTab: undefined;
};

export type BankingTabParamList = {
  AccountsTab: undefined;
  SendMoneyTab: undefined;
  BillsTab: undefined;
  InvestmentsTab: undefined;
  SettingsTab: undefined;
};

export type FlightsStackParamList = {
  FlightSearch: undefined;
  FlightResults: { searchParams: FlightSearchParams };
  FlightDetails: { flight: Flight };
  SeatSelection: { flight: Flight; seatClass: string };
  PassengerDetails: { flight: Flight; seat: Seat; seatClass: string };
  FlightPayment: { flight: Flight; seat: Seat; passenger: PassengerInfo; seatClass: string };
  FlightConfirmation: { booking: FlightBooking };
  AirlineInfo: { airline: Airline };
  FlightCompare: { flights: Flight[] };
  FlightAlerts: undefined;
  FlightReviews: { flightId: string };
  BaggageInfo: { flight: Flight };
  MealSelection: { flight: Flight; bookingId: string };
  InsuranceOptions: { flight: Flight };
  LoungAccess: { airport: string };
};

export type HotelsStackParamList = {
  HotelSearch: undefined;
  HotelResults: { searchParams: HotelSearchParams };
  HotelDetails: { hotel: Hotel };
  RoomSelection: { hotel: Hotel };
  HotelReviews: { hotelId: string; reviews: HotelReview[] };
  HotelBookingForm: { hotel: Hotel; room: HotelRoom };
  HotelPayment: { hotel: Hotel; room: HotelRoom; guestInfo: GuestInfo };
  HotelConfirmation: { booking: HotelBooking };
  HotelAmenities: { hotel: Hotel };
  NearbyAttractions: { hotel: Hotel };
  HotelPolicies: { hotel: Hotel };
  HotelGallery: { hotel: Hotel; images: string[] };
  HotelCompare: { hotels: Hotel[] };
  HotelMap: { hotels: Hotel[] };
};

export type TrainsStackParamList = {
  TrainSearch: undefined;
  TrainResults: { searchParams: TrainSearchParams };
  TrainSeatSelection: { train: Train };
  TrainPassengerDetails: { train: Train; seats: TrainSeat[] };
  TrainFoodSelection: { train: Train; bookingId: string };
  TrainPayment: { train: Train; seats: TrainSeat[]; passengers: PassengerInfo[]; food: FoodItem[] };
  TrainConfirmation: { booking: TrainBooking };
  TrainTracking: { train: Train };
  TrainSchedule: { route: string };
  PlatformInfo: { station: string };
  TrainReviews: { trainId: string };
  CoachLayout: { train: Train; coachNumber: string };
  StationFacilities: { station: string };
  BusSearch: undefined;
  BusResults: { searchParams: BusSearchParams };
  BusDetails: { bus: Bus };
  BusSeatSelection: { bus: Bus };
  BusBookingForm: { bus: Bus; seats: BusSeat[] };
  BusPayment: { bus: Bus; seats: BusSeat[]; passengers: PassengerInfo[] };
  BusConfirmation: { booking: BusBooking };
};

export type BookingsStackParamList = {
  AllBookings: undefined;
  BookingDetails: { booking: Booking };
  BookingItinerary: { booking: Booking };
  CancelBooking: { booking: Booking };
  ModifyBooking: { booking: Booking };
  RefundStatus: { bookingId: string };
  BookingReceipt: { booking: Booking };
  SupportChat: { booking: Booking };
  TravelInsurance: { booking: Booking };
  BookingHistory: undefined;
  UpcomingTrips: undefined;
  CompletedTrips: undefined;
  CancelledBookings: undefined;
};

export type AccountsStackParamList = {
  AccountsOverview: undefined;
  TransactionDetails: { transaction: Transaction };
  DisputeReport: { transaction: Transaction };
  SupportChat: { issue: string };
  CardDetails: { card: BankCard };
  CardSettings: { card: BankCard };
  AccountStatement: { accountId: string };
  SpendingAnalytics: { accountId: string };
  BeneficiaryList: undefined;
  AddBeneficiary: undefined;
  NotificationCenter: undefined;
  ProfileSettings: undefined;
  SecuritySettings: undefined;
  LinkedAccounts: undefined;
  RewardsCenter: undefined;
  CardBlock: { card: BankCard };
  PinChange: { card: BankCard };
  LimitSettings: { card: BankCard };
};

export type SendMoneyStackParamList = {
  SendMoneyHome: undefined;
  ContactsList: undefined;
  EnterAmount: { contact: Contact };
  TransferConfirmation: { contact: Contact; amount: number; note: string };
  EnterPin: { transferDetails: TransferDetails };
  TransferSuccess: { transfer: TransferResult };
  TransferReceipt: { transfer: TransferResult };
  ScanQR: undefined;
  RequestMoney: undefined;
  TransferHistory: undefined;
  ScheduledTransfers: undefined;
  CreateScheduledTransfer: { contact: Contact };
  SplitBill: undefined;
  SplitBillDetails: { split: SplitBillInfo };
  InternationalTransfer: undefined;
};

export type BillsStackParamList = {
  BillCategories: undefined;
  BillProviders: { category: BillCategory };
  EnterBillAccount: { provider: BillProvider };
  BillDetails: { bill: Bill };
  BillPayment: { bill: Bill };
  BillPaymentSuccess: { payment: BillPayment };
  BillHistory: undefined;
  AutoPaySetup: { bill: Bill };
  RechargeHome: undefined;
  RechargePlans: { operator: string; type: string };
  RechargeConfirmation: { plan: RechargePlan; number: string };
  RechargeSuccess: { recharge: RechargeResult };
  ManageAutoPay: undefined;
  BillReminders: undefined;
  DTHRecharge: undefined;
  FASTagRecharge: undefined;
};

export type InvestmentsStackParamList = {
  InvestmentsHome: undefined;
  FDCalculator: undefined;
  FDDetails: { fd: FixedDeposit };
  FDInvest: { fd: FixedDeposit; amount: number; tenure: number };
  FDConfirmation: { investment: FDInvestment };
  MutualFundsHome: undefined;
  MutualFundDetails: { fund: MutualFund };
  MutualFundInvest: { fund: MutualFund; amount: number };
  MutualFundConfirmation: { investment: MFInvestment };
  GoldInvestment: undefined;
  GoldBuy: { amount: number; type: string };
  GoldConfirmation: { investment: GoldInvestment };
  Portfolio: undefined;
  PortfolioDetails: { category: string };
  HistoricalReturns: { investmentId: string };
  InvestmentStatement: { investmentId: string };
  SIPManager: undefined;
  SIPDetails: { sip: SIPInfo };
  TaxSaver: undefined;
  TaxSaverDetails: { fund: MutualFund };
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  ProfileEdit: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  SecuritySettings: undefined;
  AppearanceSettings: undefined;
  LanguageSettings: undefined;
  CurrencySettings: undefined;
  HelpCenter: undefined;
  AboutApp: undefined;
  FeedbackForm: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  DataExport: undefined;
  DeleteAccount: undefined;
};

// ============================================================================
// TRAVEL TYPES - FLIGHTS
// ============================================================================

export type TripType = 'one-way' | 'round-trip' | 'multi-city';

export interface FlightSearchParams {
  tripType: TripType;
  from: Airport;
  to: Airport;
  departDate: string;
  returnDate?: string;
  passengers: PassengerCount;
  cabinClass: CabinClass;
  multiCityLegs?: MultiCityLeg[];
  directOnly?: boolean;
  flexDates?: boolean;
  preferredAirline?: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  terminal?: string;
}

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

export interface MultiCityLeg {
  from: Airport;
  to: Airport;
  date: string;
}

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  stopCities: string[];
  price: FlightPrice;
  cabinClass: CabinClass;
  aircraft: string;
  baggage: BaggageInfo;
  amenities: string[];
  seatAvailable: number;
  refundable: boolean;
  rating: number;
  onTimePerformance: number;
  co2Emission: number;
  layovers?: Layover[];
  fareRules?: FareRule[];
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
  color: string;
  alliance?: string;
  rating: number;
  reviewCount: number;
}

export interface FlightPrice {
  base: number;
  tax: number;
  total: number;
  currency: string;
  perPerson: number;
  discount?: number;
  originalPrice?: number;
}

export interface BaggageInfo {
  cabin: string;
  checkedIn: string;
  extraBaggagePrice: number;
}

export interface Layover {
  airport: Airport;
  duration: string;
  changeTerminal?: boolean;
}

export interface FareRule {
  type: string;
  description: string;
  charge: number;
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  type: SeatType;
  available: boolean;
  price: number;
  features: string[];
  legroom: string;
}

export type SeatType = 'window' | 'middle' | 'aisle' | 'exit-row' | 'bulkhead' | 'premium';

export interface SeatMapSection {
  cabinClass: CabinClass;
  rows: SeatRow[];
}

export interface SeatRow {
  rowNumber: number;
  seats: Seat[];
  isExitRow: boolean;
  isOverWing: boolean;
}

export interface PassengerInfo {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string;
  frequentFlyerNumber?: string;
  specialAssistance?: string[];
  mealPreference?: string;
  seatPreference?: string;
}

export interface FlightBooking {
  id: string;
  pnr: string;
  flight: Flight;
  passengers: PassengerInfo[];
  seat: Seat;
  seatClass: string;
  status: BookingStatus;
  totalAmount: number;
  paymentMethod: string;
  bookingDate: string;
  insurance?: InsuranceInfo;
  addons: BookingAddon[];
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'modified' | 'refunded';

export interface InsuranceInfo {
  id: string;
  type: string;
  coverage: string;
  premium: number;
  provider: string;
}

export interface BookingAddon {
  type: string;
  description: string;
  price: number;
}

// ============================================================================
// TRAVEL TYPES - HOTELS
// ============================================================================

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: GuestCount;
  priceRange: [number, number];
  starRating?: number[];
  amenities?: string[];
  sortBy?: string;
  propertyType?: string[];
}

export interface GuestCount {
  adults: number;
  children: number;
}

export interface Hotel {
  id: string;
  name: string;
  chain?: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  stars: number;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  images: string[];
  thumbnailUrl: string;
  amenities: HotelAmenity[];
  description: string;
  checkInTime: string;
  checkOutTime: string;
  rooms: HotelRoom[];
  policies: HotelPolicy[];
  nearbyPlaces: NearbyPlace[];
  tags: string[];
  featured: boolean;
  freeCancel: boolean;
  payAtHotel: boolean;
  couplesFriendly: boolean;
  petFriendly: boolean;
}

export interface HotelAmenity {
  id: string;
  name: string;
  icon: string;
  category: string;
  available: boolean;
}

export interface HotelRoom {
  id: string;
  name: string;
  type: string;
  description: string;
  maxGuests: number;
  bedType: string;
  size: number;
  view: string;
  pricePerNight: number;
  originalPrice?: number;
  amenities: string[];
  images: string[];
  available: number;
  cancellationPolicy: string;
  mealPlan: string;
  features: string[];
}

export interface HotelReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  images: string[];
  helpful: number;
  travelType: string;
  stayDuration: string;
  verified: boolean;
  response?: {
    from: string;
    date: string;
    message: string;
  };
}

export interface HotelPolicy {
  title: string;
  description: string;
  icon: string;
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance: string;
  rating: number;
  icon: string;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  arrivalTime?: string;
  idType?: string;
  idNumber?: string;
}

export interface HotelBooking {
  id: string;
  hotel: Hotel;
  room: HotelRoom;
  guestInfo: GuestInfo;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: string;
  bookingDate: string;
  confirmationCode: string;
}

// ============================================================================
// TRAVEL TYPES - TRAINS & BUSES
// ============================================================================

export interface TrainSearchParams {
  from: Station;
  to: Station;
  date: string;
  passengers: number;
  class: TrainClass;
  quota: string;
  flexDate?: boolean;
}

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  zone: string;
  platforms?: number;
}

export type TrainClass = 'SL' | '3A' | '2A' | '1A' | 'CC' | 'EC' | '2S' | 'GN';

export interface Train {
  id: string;
  number: string;
  name: string;
  type: TrainType;
  from: Station;
  to: Station;
  departTime: string;
  arriveTime: string;
  duration: string;
  distance: number;
  runDays: string[];
  classes: TrainClassInfo[];
  stops: TrainStop[];
  amenities: string[];
  pantryAvailable: boolean;
  rating: number;
  onTimeRating: number;
  route: string[];
}

export type TrainType = 'Rajdhani' | 'Shatabdi' | 'Duronto' | 'Garib Rath' | 'Superfast' | 'Express' | 'Mail' | 'Local' | 'Vande Bharat';

export interface TrainClassInfo {
  class: TrainClass;
  fare: number;
  available: number;
  waitlist?: number;
  lastUpdated: string;
}

export interface TrainStop {
  station: Station;
  arrival: string;
  departure: string;
  haltTime: string;
  distance: number;
  day: number;
  platform?: number;
}

export interface TrainSeat {
  id: string;
  coach: string;
  berth: string;
  berthType: BerthType;
  available: boolean;
  price: number;
}

export type BerthType = 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window' | 'Aisle';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  veg: boolean;
  available: boolean;
  rating: number;
  quantity?: number;
}

export interface TrainBooking {
  id: string;
  pnr: string;
  train: Train;
  passengers: PassengerInfo[];
  seats: TrainSeat[];
  foodItems: FoodItem[];
  class: TrainClass;
  status: BookingStatus;
  totalAmount: number;
  paymentMethod: string;
  bookingDate: string;
  chartStatus: 'prepared' | 'not-prepared';
}

export interface BusSearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
  busType?: string[];
  departTime?: string;
  operator?: string;
}

export interface Bus {
  id: string;
  operator: string;
  operatorRating: number;
  type: BusType;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  amenities: string[];
  boardingPoints: BoardingPoint[];
  droppingPoints: BoardingPoint[];
  cancellationPolicy: string;
  rating: number;
  reviewCount: number;
  liveTracking: boolean;
  images: string[];
}

export type BusType = 'AC Sleeper' | 'Non-AC Sleeper' | 'AC Semi-Sleeper' | 'Non-AC Semi-Sleeper' | 'AC Seater' | 'Non-AC Seater' | 'Volvo AC' | 'Multi-Axle';

export interface BoardingPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  landmark?: string;
}

export interface BusSeat {
  id: string;
  number: string;
  deck: 'upper' | 'lower';
  type: 'seater' | 'sleeper' | 'semi-sleeper';
  position: 'window' | 'aisle' | 'middle';
  available: boolean;
  price: number;
  forLadies: boolean;
}

export interface BusBooking {
  id: string;
  bus: Bus;
  passengers: PassengerInfo[];
  seats: BusSeat[];
  boardingPoint: BoardingPoint;
  droppingPoint: BoardingPoint;
  status: BookingStatus;
  totalAmount: number;
  paymentMethod: string;
  bookingDate: string;
}

// ============================================================================
// TRAVEL TYPES - BOOKINGS
// ============================================================================

export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'train' | 'bus';
  status: BookingStatus;
  date: string;
  totalAmount: number;
  currency: string;
  details: FlightBooking | HotelBooking | TrainBooking | BusBooking;
  timeline: BookingTimeline[];
  canCancel: boolean;
  canModify: boolean;
  paymentInfo: PaymentInfo;
}

export interface BookingTimeline {
  date: string;
  time: string;
  event: string;
  description: string;
  icon: string;
}

export interface PaymentInfo {
  method: string;
  cardLast4?: string;
  upiId?: string;
  transactionId: string;
  amount: number;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  date: string;
}

export interface CancelReason {
  id: string;
  reason: string;
  description: string;
}

export interface RefundInfo {
  amount: number;
  method: string;
  estimatedDate: string;
  status: 'processing' | 'completed' | 'failed';
  deductions: RefundDeduction[];
}

export interface RefundDeduction {
  type: string;
  amount: number;
  description: string;
}

// ============================================================================
// BANKING TYPES - ACCOUNTS
// ============================================================================

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  availableBalance: number;
  currency: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  holderName: string;
  status: 'active' | 'inactive' | 'frozen';
  openDate: string;
  interestRate: number;
  minimumBalance: number;
  linkedCards: BankCard[];
  nominees: Nominee[];
  lastUpdated: string;
}

export type AccountType = 'savings' | 'current' | 'salary' | 'fd' | 'recurring';

export interface BankCard {
  id: string;
  cardNumber: string;
  cardType: CardType;
  network: CardNetwork;
  holderName: string;
  expiryDate: string;
  status: 'active' | 'blocked' | 'expired';
  limit: number;
  availableLimit: number;
  spent: number;
  billingDate: number;
  dueDate: number;
  outstandingAmount: number;
  minimumDue: number;
  rewardPoints: number;
  color: string;
  features: string[];
  offers: CardOffer[];
}

export type CardType = 'debit' | 'credit' | 'prepaid' | 'virtual';
export type CardNetwork = 'visa' | 'mastercard' | 'rupay' | 'amex';

export interface CardOffer {
  id: string;
  title: string;
  description: string;
  merchant: string;
  discount: string;
  validTill: string;
  code: string;
  terms: string[];
}

export interface Nominee {
  name: string;
  relationship: string;
  dateOfBirth: string;
  share: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  description: string;
  merchant: string;
  merchantLogo?: string;
  merchantCategory: string;
  date: string;
  time: string;
  status: TransactionStatus;
  referenceNumber: string;
  balance: number;
  accountId: string;
  cardId?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  recurring?: boolean;
  disputeStatus?: DisputeStatus;
}

export type TransactionType = 'credit' | 'debit';
export type TransactionCategory = 'food' | 'shopping' | 'transport' | 'entertainment' | 'bills' | 'transfer' | 'salary' | 'investment' | 'refund' | 'cashback' | 'emi' | 'other';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'reversed';
export type DisputeStatus = 'none' | 'raised' | 'in-progress' | 'resolved' | 'rejected';

export interface SpendingCategory {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  count: number;
}

// ============================================================================
// BANKING TYPES - SEND MONEY
// ============================================================================

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  upiId?: string;
  bankAccount?: string;
  ifsc?: string;
  bankName?: string;
  isFavorite: boolean;
  lastTransactionDate?: string;
  lastTransactionAmount?: number;
  recentTransactions: number;
  verified: boolean;
}

export interface TransferDetails {
  contact: Contact;
  amount: number;
  note: string;
  method: TransferMethod;
  scheduledDate?: string;
  recurring?: boolean;
  frequency?: string;
}

export type TransferMethod = 'upi' | 'neft' | 'imps' | 'rtgs' | 'bank-transfer';

export interface TransferResult {
  id: string;
  transactionId: string;
  contact: Contact;
  amount: number;
  note: string;
  method: TransferMethod;
  status: 'success' | 'failed' | 'pending';
  date: string;
  time: string;
  referenceNumber: string;
  fee: number;
}

export interface SplitBillInfo {
  id: string;
  title: string;
  totalAmount: number;
  participants: SplitParticipant[];
  createdBy: string;
  date: string;
  status: 'pending' | 'settled' | 'partial';
  category: string;
}

export interface SplitParticipant {
  contact: Contact;
  amount: number;
  paid: boolean;
  paidDate?: string;
}

// ============================================================================
// BANKING TYPES - BILLS & RECHARGE
// ============================================================================

export interface BillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  providers: number;
  description: string;
}

export interface BillProvider {
  id: string;
  name: string;
  logo: string;
  category: string;
  fields: BillField[];
  popular: boolean;
}

export interface BillField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[];
  validation?: string;
}

export interface Bill {
  id: string;
  provider: BillProvider;
  accountNumber: string;
  consumerName: string;
  billAmount: number;
  dueDate: string;
  billDate: string;
  status: BillStatus;
  billDetails: BillDetail[];
  lastPayment?: {
    amount: number;
    date: string;
    method: string;
  };
  autoPay: boolean;
}

export type BillStatus = 'unpaid' | 'paid' | 'overdue' | 'partial';

export interface BillDetail {
  label: string;
  value: string;
}

export interface BillPayment {
  id: string;
  bill: Bill;
  amount: number;
  paymentMethod: string;
  status: 'success' | 'failed' | 'pending';
  transactionId: string;
  date: string;
  receipt: string;
}

export interface RechargePlan {
  id: string;
  operator: string;
  amount: number;
  validity: string;
  data: string;
  calls: string;
  sms: string;
  description: string;
  benefits: string[];
  popular: boolean;
  category: string;
}

export interface RechargeResult {
  id: string;
  transactionId: string;
  operator: string;
  number: string;
  plan: RechargePlan;
  status: 'success' | 'failed' | 'pending';
  date: string;
}

// ============================================================================
// BANKING TYPES - INVESTMENTS
// ============================================================================

export interface FixedDeposit {
  id: string;
  bankName: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  compoundingFrequency: string;
  prematureWithdrawal: boolean;
  prematureWithdrawalPenalty: number;
  seniorCitizenExtraRate: number;
  taxSaver: boolean;
  features: string[];
  rating: number;
}

export interface FDInvestment {
  id: string;
  fd: FixedDeposit;
  amount: number;
  tenure: number;
  interestRate: number;
  maturityAmount: number;
  maturityDate: string;
  startDate: string;
  status: 'active' | 'matured' | 'premature-closed';
  interestEarned: number;
  autoRenew: boolean;
}

export interface MutualFund {
  id: string;
  name: string;
  amc: string;
  category: MFCategory;
  subCategory: string;
  navValue: number;
  navDate: string;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  tenYearReturn?: number;
  risk: RiskLevel;
  rating: number;
  minInvestment: number;
  minSIP: number;
  expenseRatio: number;
  exitLoad: string;
  fundSize: number;
  fundManager: string;
  benchmark: string;
  sipAvailable: boolean;
  lumpSumAvailable: boolean;
  taxBenefit: boolean;
  holdings: FundHolding[];
  historicalNav: NavPoint[];
  description: string;
}

export type MFCategory = 'equity' | 'debt' | 'hybrid' | 'index' | 'elss' | 'liquid' | 'gilt';
export type RiskLevel = 'low' | 'moderate' | 'moderately-high' | 'high' | 'very-high';

export interface FundHolding {
  name: string;
  percentage: number;
  sector: string;
}

export interface NavPoint {
  date: string;
  value: number;
}

export interface MFInvestment {
  id: string;
  fund: MutualFund;
  amount: number;
  units: number;
  navAtPurchase: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
  investmentDate: string;
  type: 'lumpsum' | 'sip';
  sipDetails?: SIPInfo;
}

export interface SIPInfo {
  id: string;
  fundName: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'quarterly';
  startDate: string;
  nextDate: string;
  totalInvested: number;
  currentValue: number;
  installmentsPaid: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

export interface GoldInvestment {
  id: string;
  type: 'digital' | 'sovereign-bond' | 'etf';
  amount: number;
  grams: number;
  buyPrice: number;
  currentPrice: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
  date: string;
  status: 'active' | 'sold';
}

export interface PortfolioSummary {
  totalInvestment: number;
  currentValue: number;
  totalReturns: number;
  returnsPercentage: number;
  categories: PortfolioCategory[];
  monthlyInvestment: number;
  xirr: number;
}

export interface PortfolioCategory {
  name: string;
  investment: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
  percentage: number;
  color: string;
  icon: string;
}

// ============================================================================
// SETTINGS TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  kycStatus: 'verified' | 'pending' | 'not-started';
  memberSince: string;
  tier: 'silver' | 'gold' | 'platinum';
  rewardPoints: number;
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: string;
}

export interface SecurityOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'toggle' | 'action';
  icon: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface FlightFilter {
  priceRange: [number, number];
  stops: number[];
  airlines: string[];
  departTime: string[];
  arriveTime: string[];
  cabinClass: CabinClass[];
  refundable?: boolean;
  directOnly?: boolean;
}

export interface HotelFilter {
  priceRange: [number, number];
  starRating: number[];
  amenities: string[];
  propertyType: string[];
  distance: number;
  rating: number;
  freeCancel: boolean;
  payAtHotel: boolean;
}

export interface TrainFilter {
  classes: TrainClass[];
  trainTypes: TrainType[];
  departTime: string[];
  availableOnly: boolean;
  quota: string;
}

export interface BusFilter {
  busTypes: BusType[];
  priceRange: [number, number];
  departTime: string[];
  operators: string[];
  rating: number;
  amenities: string[];
}

// ============================================================================
// SORT TYPES
// ============================================================================

export type SortOption = {
  id: string;
  label: string;
  value: string;
  direction: 'asc' | 'desc';
};

// ============================================================================
// CHART DATA TYPES
// ============================================================================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}
