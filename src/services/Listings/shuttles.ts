import {api,base_url} from "../apiConfig";

export interface Shuttle {
    id: number;
    name: string;
    price: number;
    image_url: File | string;
    from_location: string;
    to_location: string;
    schedule: string;
    published: string;
}

export const pagination = {
    page: 1,
    page_size: 10,
    total_pages: 1,
    total_items: 0,
};

export const getShuttlesWithPagination = async (
  page: number = 1,
  limit: number = 10
): Promise<{ shuttles: Shuttle[]; pagination: { page: number; limit: number; totalPages: number; totalRecords: number } }> => {
  const response = await api.get(`${base_url}shuttles/?page=${page}&limit=${limit}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch shuttles with pagination");
  }
  const data = await response.data;
  return {
    shuttles: data.shuttles,
    pagination: data.pagination,
  };
}

export const getShuttles = async (): Promise<Shuttle[]> => {
    const response = await api(`${base_url}shuttles/`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch shuttles");
    }
    return response.data;
}

export const addShuttle = async (shuttle: Omit<Shuttle, "id">): Promise<Shuttle> => {
    const formData = new FormData();

    // Append the image file or URL to the form data
    if (shuttle.image_url instanceof File) {
        formData.append("image", shuttle.image_url);
    } else {
        formData.append("image_url", shuttle.image_url);
    }

    // Append other shuttle properties to the form data
    Object.entries(shuttle).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
        }
    });

    const response = await api.post(`${base_url}shuttles/`, formData);

    if (response.status !== 201) {
        throw new Error("Failed to add shuttle");
    }
    return response.data;
};

export const updateShuttle = async (id: number, shuttle: Omit<Shuttle, "id">): Promise<Shuttle> => {
    const formData = new FormData();

    // Append the image file or URL to the form data
    if (shuttle.image_url instanceof File) {
        formData.append("image", shuttle.image_url);
    } else {
        formData.append("image_url", shuttle.image_url);
    }

    // Append other shuttle properties to the form data
    Object.entries(shuttle).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
        }
    });

    const response = await api.put(`${base_url}shuttles/${id}/`, formData);

    if (response.status !== 200) {
        throw new Error("Failed to update shuttle");
    }
    return response.data;
};

export const deleteShuttle = async (id: number): Promise<void> => {
    const response = await api.delete(`${base_url}shuttles/${id}/`);

    if (response.status !== 200) {
        throw new Error("Failed to delete shuttle");
    }
};

export const publishShuttle = async(id: number, published: { published: string }): Promise<Shuttle> => {
    const data = JSON.stringify(published);
    const response = await api.post(`${base_url}shuttles/published/${id}`,data,{
        headers:{
            "Content-Type":"application/json"
        }
    });
    if(response.status !== 200){
        console.log(response)
        throw new Error("Failed to publish Shuttle")
    }

    return response.data;
}