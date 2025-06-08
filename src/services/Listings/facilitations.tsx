import {api,base_url} from "../apiConfig";

export interface Facilitation{
    id: number;
    name: string;
    description?: string;
    image_url?: File | string;
    published: string;
    price: number;
}

export const getFacilitationServices = async (): Promise<Facilitation[]> => {
    const response = await api.get(`${base_url}facilitations/`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch facilitations");
    }
    return response.data;
};


export const getFacilitationServicesWithPagination = async (
    page = 1,
    limit = 10
): Promise<{
    facilitations: Facilitation[];
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        totalRecords: number;
    };
}> => {
    const response = await api.get(`${base_url}facilitations/?page=${page}&limit=${limit}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch facilitations with pagination");
    }
    const data = await response.data;
    return {
        facilitations: data.facilitations,
        pagination: data.pagination,
    };
}

export const addFacilitationService = async (facilitation: Omit<Facilitation, 'id'>): Promise<Facilitation> => {
    const formData = new FormData();

    // Append the image file or URL to the form data
    if (facilitation.image_url instanceof File) {
        formData.append("image", facilitation.image_url);
    } else {
        formData.append("image_url", facilitation.image_url);
    }

    // Append other package properties to the form data
    Object.entries(facilitation).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
        }
    });

    const response = await api.post(`${base_url}facilitations/`, formData);

    if (response.status !== 201) {
        throw new Error("Failed to add facilitation");
    }
    return response.data;
};


export const updateFacilitationService = async (id: number, facilitation: Omit<Facilitation, 'id'>): Promise<Facilitation> => {
    const formData = new FormData();

    // Append the image file or URL to the form data
    if (facilitation.image_url instanceof File) {
        formData.append("image", facilitation.image_url);
    } else {
        formData.append("image_url", facilitation.image_url);
    }

    // Append other package properties to the form data
    Object.entries(facilitation).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
        }
    });

    const response = await api.put(`${base_url}facilitations/${id}/`, formData);
    if (response.status !== 200) {
        throw new Error("Failed to update facilitation");
    }
    return response.data;
};

export const deleteFacilitationService = async (id: number): Promise<void> => {
    const response = await api.delete(`${base_url}facilitations/${id}/`);

    if (response.status !== 200) {
        throw new Error("Failed to delete facilitation");
    }
};


export const publishFacilitation = async(id: number, published: { published: string }): Promise<Facilitation> => {
    const data = JSON.stringify(published);
    const response = await api.post(`${base_url}facilitations/published/${id}`,data,{
        headers:{
            "Content-Type":"application/json"
        }
    });
    if(response.status !== 200){
        console.log(response)
        throw new Error("Failed to publish facilitation")
    }

    return response.data;
}