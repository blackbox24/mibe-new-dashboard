import {api,base_url} from "../apiConfig";

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

const token = localStorage.getItem("travelUserToken");
export const getFlights = async (): Promise<Flight[]> => {
    const response = await api.get(`/flights/`);
    if (response.status !== 200) {
        throw new Error('Failed to fetch flights');
    }
    return response.data;
};

export const getFlightsWithPagination = async (
  page: number = 1,
  limit: number = 10
): Promise<{ flights: Flight[]; pagination: { page: number; limit: number; totalPages: number; totalRecords: number } }> => {
  const response = await api.get(`/flights/paginated/?page=${page}&limit=${limit}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch flights with pagination");
  }
  const data = await response.data;
  return {
    flights: data.flights,
    pagination: data.pagination,
  };
}


export const addFlight = async (flight: Omit<Flight, 'id'>): Promise<Flight> => {
    
    if (flight.published === "") {
        flight.published = "1";
    }
    const data = JSON.stringify(flight);
    const response = await api.post(`/flights/`, data,{
        headers:{
            "Content-Type":"application/json"
        }
    });
    if (response.status !== 201) {
        throw new Error('Failed to add flight');
    }
    return response.data;
};

export const updateFlight = async (id: number, flight: Partial<Flight>): Promise<Flight> => {
    const response = await api.put(`/flights/${id}`, {...flight},{
        headers:{
            "Content-Type":"application/json"
        }
    });
    if (response.status !== 200) {
        throw new Error('Failed to add flight');
    }
    return response.data;
};

export const deleteFlight = async (id: number): Promise<void> => {
    const response = await api.delete(`/flights/${id}`)
    if (response.status !== 204) {
        throw new Error('Failed to delete flight');
    }
};

export const publishFlights = async(id: number, published: { published: string }): Promise<Flight> => {
    const data = JSON.stringify(published);
    const response = await api.post(`/flights/published/${id}`,data,{
        headers:{
            "Content-Type":"application/json"
        }
    });
    if(response.status !== 200){
        console.log(response)
        throw new Error("Failed to publish flight")
    }

    return response.data;
}