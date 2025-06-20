import {api,base_url} from '../apiConfig';

// Interface representing an Accommodation object
export interface Accommodation {
  id: number; // Unique identifier for the accommodation
  name: string; // Name of the accommodation
  destination_id?: number | string; // Optional ID of the destination
  type: string; // Type of accommodation (e.g., hotel, apartment)
  availability: number | string; // Number of available units
  published: string; // Indicates if the accommodation is published
  price_per_night: number; // Price per night for the accommodation
  description?: string; // Optional description of the accommodation
  amenities?: string; // Optional amenities provided
  dest_name?: string;
  image_url?: File | string; // Optional URL of the accommodation's image
  rating?: number; // Optional rating of the accommodation
}

// Fetches a list of accommodations from the API
export const getAccommodations = async (): Promise<Accommodation[]> => {
  const response = await api(`/accommodations/`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch accommodations');
  }
  return response.data;
};

export const getAccommodationsWithPagination = async (page: number = 1, limit: number = 10): Promise<{
  accommodations: Accommodation[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}> => {
  const response = await api.get(`/accommodations/paginated/?page=${page}&limit=${limit}`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch accommodations with pagination');
  }
  const data = await response.data;
  return {
    accommodations: data.accommodations,
    pagination: data.pagination,
  };
}

// Adds a new accommodation to the API
export const addAccommodation = async (
  accommodation: Omit<Accommodation, 'id'> // Excludes 'id' since it's generated by the server
): Promise<Accommodation> => {
  const formData = new FormData();

  // Append the image URL if provided
  formData.append('image', accommodation.image_url);

  // Append other fields to the form data
  Object.entries(accommodation).forEach(([key, value]) => {
    if (key !== 'image_url' && value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });

  const response = await api.post(`/accommodations/`, formData);

  if (response.status !== 201) {
    throw new Error('Failed to add accommodation');
  }

  return response.data;
};

// Updates an existing accommodation in the API
export const updateAccommodation = async (
  id: number, // ID of the accommodation to update
  accommodation: Partial<Accommodation> // Partial object to allow updating specific fields
): Promise<Accommodation> => {
  const formData = new FormData();

  // Append the image URL if provided]
  formData.append('image', accommodation.image_url as File);

  // Append other fields to the form data
  Object.entries(accommodation).forEach(([key, value]) => {
    if (key !== 'image_url' && value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });

  const response = await api.put(`/accommodations/${id}`, formData);

  if (response.status !== 200) {
    throw new Error('Failed to update accommodation');
  }

  return response.data;
};

// Deletes an accommodation from the API
export const deleteAccommodation = async (id: number): Promise<void> => {
  const response = await api.delete(`/accommodations/${id}`);

  if (response.status !== 200) {
    throw new Error('Failed to delete accommodation');
  }
};

export const publishAccommodation = async(id: number, published: { published: string }): Promise<Accommodation> => {
    const data = JSON.stringify(published);
    const response = await api.post(`/accommodations/published/${id}`,data,{
        headers:{
            "Content-Type":"application/json"
        }
    });
    if(response.status !== 200){
        throw new Error("Failed to publish acommodations")
    }

    return response.data;
}