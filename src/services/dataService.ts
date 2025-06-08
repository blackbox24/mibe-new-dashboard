import { publicDecrypt } from "crypto";

// Type definitions
export interface Flight {
  id: number;
  flight_number: string;
  published: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  image_url?: string;
  description?: string;
  location?: string;
}

export interface Accommodation {
  id: number;
  name: string;
  published: string;
  destination_id?: number;
  type: string;
  price_per_night: number;
  description?: string;
  amenities?: string;
  image_url?: string;
  rating?: number;
  location?: string;
}

export interface Package {
  id: number;
  name: string;
  published: string;
  destination_id?: number;
  description?: string;
  price: number;
  duration: string;
  image_url?: string;
  featured?: boolean;
  rating?: number;
  travel_type?: string;
}

export interface Vehicle {
  id: number;
  name: string;
  published: string;
  type: string;
  price_per_day: number;
  seats: number;
  transmission?: string;
  fuel_type?: string;
  description?: string;
  image_url?: string;
  available?: boolean;
  features?: string;
  location?: string;
}

export interface Shuttle {
  id: number;
  name: string;
  published: string;
  from_location: string;
  to_location: string;
  price: number;
  schedule?: string;
  image_url?: string;
  description?: string;
}

export interface FacilitationService {
  id: number;
  name: string;
  published: string;
  description?: string;
  price: number;
  image_url?: string;
}

export interface Activity {
  id: number;
  name: string;
  published: string;
  destination_id?: number;
  description?: string;
  price: number;
  duration?: string;
  image_url?: string;
}

// Mock data
const flights: Flight[] = [
  {
    id: 1,
    flight_number: 'KQ100',
    published: "1",
    airline: 'Kenya Airways',
    departure_city: 'Nairobi',
    arrival_city: 'Dar es Salaam',
    departure_time: '2023-07-15 08:00:00',
    arrival_time: '2023-07-15 09:30:00',
    price: 300,
    image_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 2,
    flight_number: 'PW202',
    published: "1",
    airline: 'Precision Air',
    departure_city: 'Dar es Salaam',
    arrival_city: 'Zanzibar',
    departure_time: '2023-07-15 11:00:00',
    arrival_time: '2023-07-15 11:45:00',
    price: 150,
    image_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 3,
    flight_number: 'KQ305',
    published: "1",
    airline: 'Kenya Airways',
    departure_city: 'Nairobi',
    arrival_city: 'Kilimanjaro',
    departure_time: '2023-07-16 09:00:00',
    arrival_time: '2023-07-16 10:00:00',
    price: 250,
    image_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 4,
    flight_number: 'ET501',
    published: "1",
    airline: 'Ethiopian Airlines',
    departure_city: 'Addis Ababa',
    arrival_city: 'Nairobi',
    departure_time: '2023-07-17 07:30:00',
    arrival_time: '2023-07-17 09:30:00',
    price: 400,
    image_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1470&auto=format&fit=crop'
  }
];

const accommodations: Accommodation[] = [
  {
    id: 1,
    name: 'Zanzibar Beach Resort',
    published: "1",
    destination_id: 1,
    type: 'Resort',
    price_per_night: 250,
    description: 'Luxury beachfront resort with stunning ocean views',
    amenities: 'Swimming pool, Restaurant, Spa, Free WiFi, Beach access',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop',
    rating: 4.7
  },
  {
    id: 2,
    name: 'Serengeti Safari Lodge',
    published: "1",
    destination_id: 2,
    type: 'Lodge',
    price_per_night: 350,
    description: 'Premium safari lodge in the heart of Serengeti',
    amenities: 'Game drives, Restaurant, Bar, Guided tours, Viewing deck',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Mara River Camp',
    published: "1",
    destination_id: 3,
    type: 'Camp',
    price_per_night: 200,
    description: 'Tented camp offering authentic safari experience',
    amenities: 'En-suite tents, Restaurant, Game drives, Bush dining',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop',
    rating: 4.5
  },
  {
    id: 4,
    name: 'Kilimanjaro View Hotel',
    published: "1",
    destination_id: 4,
    type: 'Hotel',
    price_per_night: 150,
    description: 'Comfortable hotel with views of Mount Kilimanjaro',
    amenities: 'Restaurant, Bar, Free WiFi, Airport shuttle',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop',
    rating: 4.3
  },
  {
    id: 5,
    name: 'Victoria Falls Resort',
    published: "1",
    destination_id: 5,
    type: 'Resort',
    price_per_night: 280,
    description: 'Luxury resort near the magnificent Victoria Falls',
    amenities: 'Swimming pool, Spa, Multiple restaurants, Falls view',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop',
    rating: 4.8
  }
];

const packages: Package[] = [
  {
    id: 1,
    name: 'Zanzibar Beach Getaway',
    published: "1",
    destination_id: 1,
    description: 'Enjoy pristine beaches and the rich culture of Zanzibar',
    price: 1200,
    duration: '7 days',
    image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
    featured: true,
    rating: 4.8,
    travel_type: 'Beach'
  },
  {
    id: 2,
    name: 'Serengeti Safari Adventure',
    published: "1",
    destination_id: 2,
    description: 'Witness the great migration and big five',
    price: 1800,
    duration: '5 days',
    image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
    featured: true,
    rating: 4.9,
    travel_type: 'Safari'
  },
  {
    id: 3,
    name: 'Kilimanjaro Climbing Expedition',
    published: "1",
    destination_id: 4,
    description: 'Conquer Africa\'s highest peak',
    price: 2500,
    duration: '8 days',
    image_url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
    featured: true,
    rating: 4.7,
    travel_type: 'Adventure'
  },
  {
    id: 4,
    name: 'East African Wildlife Tour',
    published: "1",
    destination_id: 3,
    description: 'Experience the best wildlife Kenya has to offer',
    price: 2200,
    duration: '6 days',
    image_url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
    featured: true,
    rating: 4.6,
    travel_type: 'Safari'
  },
  {
    id: 5,
    name: 'Victoria Falls Experience',
    published: "1",
    destination_id: 5,
    description: 'Marvel at the mighty Victoria Falls',
    price: 1500,
    duration: '4 days',
    image_url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
    featured: false,
    rating: 4.5,
    travel_type: 'Sightseeing'
  }
];

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: 'Toyota Land Cruiser',
    published: "1",
    type: 'SUV',
    price_per_day: 120,
    seats: 7,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    description: 'Perfect for safari adventures with 4x4 capability',
    image_url: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d',
    available: true
  },
  {
    id: 2,
    name: 'Toyota RAV4',
    published: "1",
    type: 'SUV',
    price_per_day: 80,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    description: 'Comfortable and reliable compact SUV',
    image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
    available: true
  },
  {
    id: 3,
    name: 'Toyota Hiace',
    published: "1",
    type: 'Van',
    price_per_day: 100,
    seats: 12,
    transmission: 'Manual',
    fuel_type: 'Diesel',
    description: 'Spacious van ideal for group travel',
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
    available: true
  },
  {
    id: 4,
    name: 'Toyota Corolla',
    published: "1",
    type: 'Sedan',
    price_per_day: 60,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    description: 'Economical and comfortable sedan',
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
    available: true
  },
  {
    id: 5,
    name: 'Suzuki Jimny',
    published: "1",
    type: 'SUV',
    price_per_day: 70,
    seats: 4,
    transmission: 'Manual',
    fuel_type: 'Petrol',
    description: 'Compact 4x4 for adventure travel',
    image_url: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be',
    available: true
  }
];

const shuttles: Shuttle[] = [
  {
    id: 1,
    name: 'Arusha-Serengeti Shuttle',
    published: "1",
    from_location: 'Arusha',
    to_location: 'Serengeti National Park',
    price: 80,
    schedule: 'Daily departures at 07:00',
    image_url: 'https://images.unsplash.com/photo-1464219222984-216ebffaaf85?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Nairobi-Mombasa Express',
    published: "1",
    from_location: 'Nairobi',
    to_location: 'Mombasa',
    price: 50,
    schedule: 'Departures at 08:00 and 20:00 daily',
    image_url: 'https://images.unsplash.com/photo-1464219222984-216ebffaaf85?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Zanzibar Airport Transfer',
    published: "1",
    from_location: 'Zanzibar Airport',
    to_location: 'Stone Town/Beach Hotels',
    price: 25,
    schedule: 'Available for all flight arrivals',
    image_url: 'https://images.unsplash.com/photo-1464219222984-216ebffaaf85?q=80&w=1470&auto=format&fit=crop'
  }
];

const facilitationServices: FacilitationService[] = [
  {
    id: 1,
    name: 'Visa Processing',
    published: "1",
    description: 'Fast and reliable visa application processing for various African countries',
    price: 50,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Airport Meet & Greet',
    published: "1",
    description: 'VIP airport reception and assistance with immigration and customs',
    price: 35,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Travel Insurance',
    published: "1",
    description: 'Comprehensive travel insurance packages for your African adventure',
    price: 45,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop'
  }
];

const activities: Activity[] = [
  {
    id: 1,
    name: 'Hot Air Balloon Safari',
    published: "1",
    destination_id: 2,
    description: 'Sunrise balloon safari over the Serengeti plains with champagne breakfast',
    price: 450,
    duration: '3-4 hours',
    image_url: 'https://images.unsplash.com/photo-1495819427834-1954f20ebb97?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Snorkeling Trip',
    published: "1",
    destination_id: 1,
    description: 'Guided snorkeling adventure in Zanzibar\'s coral reefs',
    price: 60,
    duration: '3 hours',
    image_url: 'https://images.unsplash.com/photo-1495819427834-1954f20ebb97?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Maasai Village Visit',
    published: "1",
    destination_id: 3,
    description: 'Cultural experience with the Maasai people',
    price: 45,
    duration: '2 hours',
    image_url: 'https://images.unsplash.com/photo-1495819427834-1954f20ebb97?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Bungee Jumping',
    published: "1",
    destination_id: 5,
    description: 'Adrenaline-pumping bungee jumping experience at Victoria Falls',
    price: 120,
    duration: '1 hour',
    image_url: 'https://images.unsplash.com/photo-1495819427834-1954f20ebb97?q=80&w=1470&auto=format&fit=crop'
  }
];

// Service functions
export const getFlights = (): Promise<Flight[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(flights);
    }, 500);
  });
};

export const getAccommodations = (): Promise<Accommodation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(accommodations);
    }, 500);
  });
};

export const getPackages = (): Promise<Package[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(packages);
    }, 500);
  });
};

export const getVehicles = (): Promise<Vehicle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(vehicles);
    }, 500);
  });
};

export const getShuttles = (): Promise<Shuttle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(shuttles);
    }, 500);
  });
};

export const getFacilitationServices = (): Promise<FacilitationService[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(facilitationServices);
    }, 500);
  });
};

export const getActivities = (): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(activities);
    }, 500);
  });
};

// Extended service functions
export const addActivity = async (activity: Partial<Activity>): Promise<Activity> => {
  // Mock implementation - in production this would be a real API call
  console.log('Adding activity:', activity);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newActivity = {
        id: Math.floor(Math.random() * 10000),
        name: activity.name || '',
        destination_id: activity.destination_id || null,
        description: activity.description || '',
        price: activity.price || 0,
        duration: activity.duration || null,
        image_url: activity.image_url || null,
        published: activity.published || "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      resolve(newActivity as Activity);
    }, 500);
  });
};

export const updateActivity = async (id: number, activity: Partial<Activity>): Promise<Activity> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedActivity = {
        ...activity,
        id,
        updated_at: new Date().toISOString(),
      };
      resolve(updatedActivity as Activity);
    }, 500);
  });
};

export const deleteActivity = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const addPackage = async (pkg: Partial<Package>): Promise<Package> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPackage = {
        id: Math.floor(Math.random() * 10000),
        name: pkg.name || '',
        destination_id: pkg.destination_id || null,
        description: pkg.description || '',
        price: pkg.price || 0,
        duration: pkg.duration || '',
        image_url: pkg.image_url || null,
        featured: pkg.featured || false,
        rating: pkg.rating || null,
        travel_type: pkg.travel_type || null,
        published: pkg.published || "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      resolve(newPackage as Package);
    }, 500);
  });
};

export const updatePackage = async (id: number, pkg: Partial<Package>): Promise<Package> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedPackage = {
        ...pkg,
        id,
        updated_at: new Date().toISOString(),
      };
      resolve(updatedPackage as Package);
    }, 500);
  });
};

export const deletePackage = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const addAccommodation = async (accommodation: Partial<Accommodation>): Promise<Accommodation> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAccommodation = {
        id: Math.floor(Math.random() * 10000),
        name: accommodation.name || '',
        destination_id: accommodation.destination_id || null,
        type: accommodation.type || '',
        price_per_night: accommodation.price_per_night || 0,
        description: accommodation.description || '',
        amenities: accommodation.amenities || null,
        image_url: accommodation.image_url || null,
        rating: accommodation.rating || null,
        published: accommodation.published || "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: accommodation.location || null,
      };
      resolve(newAccommodation as Accommodation);
    }, 500);
  });
};

export const updateAccommodation = async (id: number, accommodation: Partial<Accommodation>): Promise<Accommodation> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedAccommodation = {
        ...accommodation,
        id,
        updated_at: new Date().toISOString(),
      };
      resolve(updatedAccommodation as Accommodation);
    }, 500);
  });
};

export const deleteAccommodation = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const addVehicle = async (vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newVehicle = {
        id: Math.floor(Math.random() * 10000),
        name: vehicle.name || '',
        published: vehicle.published || "1",
        type: vehicle.type || '',
        price_per_day: vehicle.price_per_day || 0,
        seats: vehicle.seats || 0,
        transmission: vehicle.transmission || null,
        fuel_type: vehicle.fuel_type || null,
        description: vehicle.description || null,
        image_url: vehicle.image_url || null,
        available: vehicle.available ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        features: vehicle.features || null,
        location: vehicle.location || null,
      };
      resolve(newVehicle as Vehicle);
    }, 500);
  });
};

export const updateVehicle = async (id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedVehicle = {
        ...vehicle,
        id,
        updated_at: new Date().toISOString(),
      };
      resolve(updatedVehicle as Vehicle);
    }, 500);
  });
};

export const deleteVehicle = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const addShuttle = async (shuttle: Partial<Shuttle>): Promise<Shuttle> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newShuttle = {
        id: Math.floor(Math.random() * 10000),
        name: shuttle.name || '',
        published: shuttle.published || "1",
        from_location: shuttle.from_location || '',
        to_location: shuttle.to_location || '',
        price: shuttle.price || 0,
        schedule: shuttle.schedule || null,
        image_url: shuttle.image_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: shuttle.description || null,
      };
      resolve(newShuttle as Shuttle);
    }, 500);
  });
};

export const updateShuttle = async (id: number, shuttle: Partial<Shuttle>): Promise<Shuttle> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedShuttle = {
        ...shuttle,
        id,
        updated_at: new Date().toISOString(),
      };
      resolve(updatedShuttle as Shuttle);
    }, 500);
  });
};

export const deleteShuttle = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const addFacilitationService = async (service: Partial<FacilitationService>): Promise<FacilitationService> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newService = {
        id: Math.floor(Math.random() * 10000),
        name: service.name || '',
        published: service.published || "1",
        description: service.description || '',
        price: service.price || 0,
        image_url: service.image_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      resolve(newService as FacilitationService);
    }, 500);
  });
};

export const updateFacilitationService = async (id: number, service: Partial<FacilitationService>): Promise<FacilitationService> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedService = {
        ...service,
        id,
        updated_at: new Date().toISOString(),
      };
      resolve(updatedService as FacilitationService);
    }, 500);
  });
};

export const deleteFacilitationService = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const addFlight = async (flight: Partial<Flight>): Promise<Flight> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFlight = {
        id: Math.floor(Math.random() * 10000),
        flight_number: flight.flight_number || '',
        published: flight.published || "1",
        airline: flight.airline || '',
        departure_city: flight.departure_city || '',
        arrival_city: flight.arrival_city || '',
        departure_time: flight.departure_time || new Date().toISOString(),
        arrival_time: flight.arrival_time || new Date().toISOString(),
        price: flight.price || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: flight.description || null,
        location: flight.location || null,
        image_url: flight.image_url || null,
      };
      resolve(newFlight as Flight);
    }, 500);
  });
};

export const updateFlight = async (id: number, flight: Partial<Flight>): Promise<Flight> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedFlight = {
        ...flight,
        id,
        updated_at: new Date().toISOString(),
      };
      resolve(updatedFlight as Flight);
    }, 500);
  });
};

export const deleteFlight = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

// New types and services for bookings
export type Booking = {
  id: number;
  user_id: number;
  booking_type: 'package' | 'accommodation' | 'vehicle' | 'flight' | 'shuttle' | 'facilitation' | 'activity';
  item_id: number;
  start_date: string;
  end_date: string | null;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  user_name?: string;
  item_name?: string;
  replies?: BookingReply[];
};

export type BookingReply = {
  id: number;
  booking_id: number;
  message: string;
  created_at: string;
  is_admin: boolean;
};

export const getBookings = async (): Promise<Booking[]> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          user_id: 101,
          booking_type: 'package',
          item_id: 1,
          start_date: '2025-06-15',
          end_date: '2025-06-22',
          total_price: 1200,
          status: 'confirmed',
          created_at: '2025-05-10T14:30:00Z',
          updated_at: '2025-05-10T15:00:00Z',
          user_name: 'John Doe',
          item_name: 'Zanzibar Beach Getaway',
          replies: [
            {
              id: 1,
              booking_id: 1,
              message: 'I have some dietary restrictions. Can you accommodate?',
              created_at: '2025-05-10T16:00:00Z',
              is_admin: false
            },
            {
              id: 2,
              booking_id: 1,
              message: 'Yes, we can accommodate your dietary needs. Please provide details.',
              created_at: '2025-05-10T16:30:00Z',
              is_admin: true
            }
          ]
        },
        {
          id: 2,
          user_id: 102,
          booking_type: 'accommodation',
          item_id: 2,
          start_date: '2025-07-10',
          end_date: '2025-07-15',
          total_price: 750,
          status: 'pending',
          created_at: '2025-05-12T09:15:00Z',
          updated_at: '2025-05-12T09:15:00Z',
          user_name: 'Jane Smith',
          item_name: 'Serengeti Safari Lodge',
          replies: []
        },
        {
          id: 3,
          user_id: 103,
          booking_type: 'flight',
          item_id: 1,
          start_date: '2025-06-20',
          end_date: null,
          total_price: 300,
          status: 'confirmed',
          created_at: '2025-05-08T11:45:00Z',
          updated_at: '2025-05-08T12:30:00Z',
          user_name: 'Robert Johnson',
          item_name: 'KQ100 Nairobi to Dar es Salaam',
          replies: []
        }
      ]);
    }, 500);
  });
};

export const addBookingReply = async (bookingId: number, message: string): Promise<BookingReply> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 10000),
        booking_id: bookingId,
        message,
        created_at: new Date().toISOString(),
        is_admin: true
      });
    }, 500);
  });
};

// New types and services for leads
export type Lead = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  interest: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  created_at: string;
  replies?: LeadReply[];
};

export type LeadReply = {
  id: number;
  lead_id: number;
  message: string;
  created_at: string;
};

export const getLeads = async (): Promise<Lead[]> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          phone: '+1234567890',
          message: 'I am interested in the Serengeti Safari Adventure package. Can you provide more details?',
          interest: 'Safari Packages',
          status: 'new',
          created_at: '2025-05-03T10:15:00Z',
          replies: []
        },
        {
          id: 2,
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          phone: '+9876543210',
          message: 'Looking for accommodation options in Zanzibar for a family of four.',
          interest: 'Accommodation',
          status: 'contacted',
          created_at: '2025-05-02T14:30:00Z',
          replies: [
            {
              id: 1,
              lead_id: 2,
              message: 'Thank you for your interest. I have sent you some options that would be perfect for families.',
              created_at: '2025-05-02T15:45:00Z'
            }
          ]
        },
        {
          id: 3,
          name: 'David Taylor',
          email: 'david.taylor@example.com',
          message: 'I need a vehicle rental for 5 days in Nairobi.',
          interest: 'Vehicle Rental',
          status: 'qualified',
          created_at: '2025-05-01T09:00:00Z',
          replies: []
        }
      ]);
    }, 500);
  });
};

export const addLeadReply = async (leadId: number, message: string): Promise<LeadReply> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 10000),
        lead_id: leadId,
        message,
        created_at: new Date().toISOString()
      });
    }, 500);
  });
};

// New types and services for partners
export type Partner = {
  id: number;
  name: string;
  logo_url: string | null;
  website: string | null;
  created_at: string;
  description?: string;
  partnership_type?: string;
  published?: "1" | "0";
};

export const getAllPartners = async (): Promise<Partner[]> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Kenya Airways',
          logo_url: 'https://images.unsplash.com/photo-1499063078284-f78f7d89616a',
          website: 'https://www.kenya-airways.com',
          created_at: '2025-05-04T17:47:57',
          description: 'Official airline partner providing special rates for our clients.',
          partnership_type: 'Airline',
          published: "1"
        },
        {
          id: 2,
          name: 'Serena Hotels',
          logo_url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
          website: 'https://www.serenahotels.com',
          created_at: '2025-05-04T17:47:57',
          description: 'Luxury accommodation partner across East Africa.',
          partnership_type: 'Hotel Chain',
          published: "1"
        },
        {
          id: 3,
          name: 'Tanzania Tourism Board',
          logo_url: 'https://images.unsplash.com/photo-1518001335271-e104b12c686f',
          website: 'https://www.tanzaniatourism.go.tz',
          created_at: '2025-05-04T17:47:57',
          description: 'Official tourism board partnership for authentic Tanzanian experiences.',
          partnership_type: 'Tourism Board',
          published: "1"
        },
        {
          id: 4,
          name: 'Safari Link',
          logo_url: 'https://images.unsplash.com/photo-1536516677467-a8cf206e1066',
          website: 'https://www.flysafarilink.com',
          created_at: '2025-05-04T17:47:57',
          description: 'Regional airline specializing in safari destinations.',
          partnership_type: 'Airline',
          published: "1"
        }
      ]);
    }, 500);
  });
};

export const addPartner = async (partner: Partial<Partner>): Promise<Partner> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPartner = {
        id: Math.floor(Math.random() * 10000),
        name: partner.name || '',
        logo_url: partner.logo_url || null,
        website: partner.website || null,
        created_at: new Date().toISOString(),
        published: partner.published || "1",
        description: partner.description || '',
        partnership_type: partner.partnership_type || ''
      };
      resolve(newPartner as Partner);
    }, 500);
  });
};

export const updatePartner = async (id: number, partner: Partial<Partner>): Promise<Partner> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedPartner = {
        ...partner,
        id,
      };
      resolve(updatedPartner as Partner);
    }, 500);
  });
};

export const deletePartner = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

// New types and services for resources
export type TravelResource = {
  id: number;
  title: string;
  type: string;
  description: string | null;
  content: string | null;
  image_url: File | string | null;
  published?: "1" | "0";
  created_at: string;
  updated_at: string;
};

export const getTravelResources = async (): Promise<TravelResource[]> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Tanzania Safari Guide',
          type: 'guide',
          description: 'Complete guide to planning your Tanzania safari adventure',
          content: 'Detailed content about Tanzania safari planning, best time to visit, etc.',
          image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
          published: "1",
          created_at: '2025-05-04T17:47:57',
          updated_at: '2025-05-04T17:47:57'
        },
        {
          id: 2,
          title: 'My Kilimanjaro Climb',
          type: 'story',
          description: 'Personal story of conquering Mount Kilimanjaro',
          content: 'Day by day account of climbing Africa\'s highest peak',
          image_url: 'https://images.unsplash.com/photo-1621414050345-98d882cc5ff0',
          published: "1",
          created_at: '2025-05-04T17:47:57',
          updated_at: '2025-05-04T17:47:57'
        },
        {
          id: 3,
          title: 'African Safari Packing List',
          type: 'toolkit',
          description: 'Essential items to pack for your African safari',
          content: 'Comprehensive packing list with recommendations',
          image_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
          published: "1",
          created_at: '2025-05-04T17:47:57',
          updated_at: '2025-05-04T17:47:57'
        }
      ]);
    }, 500);
  });
};

export const addResource = async (resource: Partial<TravelResource>): Promise<TravelResource> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newResource = {
        id: Math.floor(Math.random() * 10000),
        title: resource.title || '',
        type: resource.type || 'guide',
        description: resource.description || '',
        content: resource.content || '',
        image_url: resource.image_url || null,
        published: resource.published || "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      resolve(newResource as TravelResource);
    }, 500);
  });
};

export const updateResource = async (id: number, resource: Partial<TravelResource>): Promise<TravelResource> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedResource = {
        ...resource,
        id,
        updated_at: new Date().toISOString()
      };
      resolve(updatedResource as TravelResource);
    }, 500);
  });
};

export const deleteResource = async (id: number): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};


export interface Destination {
  id: number;
  name: string;
  region: string;
  country: string;
  published?: "1" | "0";
  image_url: string;
}

export const getAllDestinations = async (): Promise<Destination[]> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Zanzibar',
          region: 'East Africa',
          country: 'Tanzania',
          image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
          published: "1"
        },
        {
          id: 2,
          name: 'Serengeti National Park',
          region: 'East Africa',
          country: 'Tanzania',
          image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
          published: "0"
        },
        {
          id: 3,
          name: 'Maasai Mara',
          region: 'East Africa',
          country: 'Kenya',
          image_url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
          published: "1"
        },
        {
          id: 4,
          name: 'Mount Kilimanjaro',
          region: 'East Africa',
          country: 'Tanzania',
          image_url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
          published: "1"
        },
        {
          id: 5,
          name: 'Victoria Falls',
          region: 'Southern Africa',
          country: 'Zimbabwe/Zambia',
          image_url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
          published: "0"
        }
      ]);
    }, 500);
  });
}

export const addDestination = async( destination : Partial<Destination>): Promise<Destination> => {
  return new Promise(() => {
    setTimeout(() => {
      const newDestination = {
        id: Math.floor(Math.random() * 10000),
        name: destination.name || '',
        region: destination.region || '',
        country: destination.country || '',
        image_url: destination.image_url || null
      };
      return newDestination as Destination;
    }, 500);
  });
}
export const updateDestination = async(id: number, destination: Partial<Destination>): Promise<Destination> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedDestination = {
        ...destination,
        id,
      };
      resolve(updatedDestination as Destination);
    }, 500);
  });
}

export const deleteDestination = async (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}


export interface Gift {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: File | string | null;
  published?: "1" | "0";
  status: "Active" | "Draft" | "Archived";
}

export const getAllGifts = async (): Promise<Gift[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Zanzibar Beach Getaway',
          description: 'A relaxing beach vacation in Zanzibar with all-inclusive amenities.',
          price: 1200,
          status: 'Active',
          published: "1",
          image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99'
        },
        {
          id: 2,
          title: 'Serengeti Safari Adventure',
          description: 'Experience the wildlife of Serengeti with guided tours and luxury accommodation.',
          price: 2500,
          status: 'Draft',
          published: "1",
          image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99'
        },
        {
          id: 3,
          title: 'Kilimanjaro Climb Package',
          description: 'An adventurous trek to the summit of Mount Kilimanjaro with expert guides.',
          price: 3000,
          status: 'Archived',
          published: "0",
          image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99'
        }
      ]);
    }, 500);
  });
}

export const addGift = async (gift: Partial<Gift>): Promise<Gift> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGift = {
        id: Math.floor(Math.random() * 10000),
        title: gift.title || '',
        description: gift.description || '',
        price: gift.price || 0,
        published: gift.published || "1",
        status: gift.status || 'Active'
      };
      resolve(newGift as Gift);
    }, 500);
  });
};

export const updateGift = async (id: number, gift: Partial<Gift>): Promise<Gift> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedGift = {
        ...gift,
        id,
      };
      resolve(updatedGift as Gift);
    }, 500);
  });
}

export const deleteGift = async (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}


export interface CulturalEvent {
  id: number;
  title: string;
  description: string;
  image_url: File | string | null;
  published?: "1" | "0";
}

export const getAllCulturalEvents = async(): Promise<CulturalEvent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Maasai Culture',
          description: 'Explore the rich traditions and customs of the Maasai people.',
          image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
          published: "1"
        },
        {
          id: 2,
          title: 'Swahili Culture',
          description: 'Discover the vibrant Swahili culture along the East African coast.',
          image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
          published: "1"
        },
        {
          id: 3,
          title: 'Zanzibar Culture',
          description: 'Experience the unique blend of African, Arab, and Indian influences in Zanzibar.',
          image_url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
          published: "0"
        }
      ]);
    }, 500);
  });
}

export const addCulturalEvent = async (event: Partial<CulturalEvent>): Promise<CulturalEvent> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent = {
        id: Math.floor(Math.random() * 10000),
        title: event.title || '',
        description: event.description || '',
        image_url: event.image_url || null,
        published: event.published || "1"
      };
      resolve(newEvent as CulturalEvent);
    }, 500);
  });
};

export const updateCulturalEvent = async (id: number, event: Partial<CulturalEvent>): Promise<CulturalEvent> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedEvent = {
        ...event,
        id,
      };
      resolve(updatedEvent as CulturalEvent);
    }, 500);
  });
}

export const deleteCulturalEvent = async (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}


export interface Team{
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  published: "1" | "0";
}
export const getAllTeams = async() : Promise<Team[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Team A',
          description: 'Description for Team A',
          status: 'Active',
          published: '1'
        },
        {
          id: 2,
          name: 'Team B',
          description: 'Description for Team B',
          status: 'Inactive',
          published: '0'
        }
      ]);
    }, 500);
  });
}

export const addTeam = async(team: Partial<Team>): Promise<Team> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      const newTeam = {
        id: Math.floor(Math.random() * 10000),
        name: team.name || '',
        description: team.description || '',
        status: team.status || 'Active',
        published: team.published || '1'
      };
      resolve(newTeam as Team);
    }, 500);
  });
}

export const updateTeam = async(id:number, team: Partial<Team>): Promise<Team> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      const updatedTeam = {
        ...team,
        id,
      };
      resolve(updatedTeam as Team);
    }, 500);
  });
}


export const deleteTeam = async(id:number): Promise<boolean> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(true)
    },500)
  })
}

export interface Job{
  id:number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  published: "1" | "0";
}

export const getAllJobs = async(): Promise<Job[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Software Engineer',
          description: 'Develop and maintain web applications.',
          status: 'Active',
          published: '1'
        },
        {
          id: 2,
          name: 'Project Manager',
          description: 'Oversee project planning and execution.',
          status: 'Inactive',
          published: '0'
        }
      ]);
    }, 500);
  });
}

export const addJob = async(job: Partial<Job>): Promise<Job> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      const newJob = {
        id: Math.floor(Math.random() * 10000),
        name: job.name || '',
        description: job.description || '',
        status: job.status || 'Active',
        published: job.published || '1'
      };
      resolve(newJob as Job);
    }, 500);
  });
}

export const updateJob = async(id: number, job: Partial<Job>): Promise<Job> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      const updatedJob = {
        ...job,
        id,
      };
      resolve(updatedJob as Job);
    }, 500);
  });
}

export const deleteJob = async(id: number): Promise<boolean> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(true);
    }, 500);
  }
)}


export interface CaseStudy{
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  published: "1" | "0";
}

export const getAllCaseStudies = async(): Promise<CaseStudy[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Zanzibar Beach Resort',
          description: 'A case study on the success of Zanzibar Beach Resort in attracting tourists.',
          status: 'Active',
          published: '1'
        },
        {
          id: 2,
          name: 'Serengeti Safari Tours',
          description: 'An analysis of Serengeti Safari Tours\' impact on local communities.',
          status: 'Inactive',
          published: '0'
        }
      ]);
    }, 500);
  });
}


export const addCaseStudy = async(caseStudy: Partial<CaseStudy>): Promise<CaseStudy> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      const newCaseStudy = {
        id: Math.floor(Math.random() * 10000),
        name: caseStudy.name || '',
        description: caseStudy.description || '',
        status: caseStudy.status || 'Active',
        published: caseStudy.published || '1'
      };
      resolve(newCaseStudy as CaseStudy);
    }, 500);
  });
}

export const updateCaseStudy = async(id: number, caseStudy: Partial<CaseStudy>): Promise<CaseStudy> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      const updatedCaseStudy = {
        ...caseStudy,
        id,
      };
      resolve(updatedCaseStudy as CaseStudy);
    }, 500);
  });
}

export const deleteCaseStudy = async(id: number): Promise<boolean> => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(true);
    }, 500);
  });
}
