import {api,base_url} from "../apiConfig";

// Interface representing a package
export interface Package {
    id: number; // Unique identifier for the package
    name: string; // Name of the package
    published: string; // Whether the package is published
    description: string; // Description of the package
    image_url: File | string; // Can be a URL or a File object
    price: number; // Price of the package
    travel_type?: string; // Optional, e.g., "Domestic", "International"
    duration?: string; // Optional, e.g., "3 days", "1 week"
    rating?: number; // Optional, e.g., 4.5
    featured?: boolean | string; // Optional, true if the package is featured
    status: number; // Status of the package (e.g., active or inactive)
    discount_price?: number | null;
    includes: string;
    excludes: string;
    itinerary: string | null; 
    max_people: number | null;
    start_date: Date | null;
    end_date: Date | null; 
    destination_id?: number | string; // Optional, ID of the destination associated with the package
}

// Fetch all packages from the API
export const getPackages = async (): Promise<Package[]> => {
    const response = await api.get(`/packages/`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch packages");
    }
    return response.data;
};

// Add a new package to the API
export const addPackage = async (
    pkg: Omit<Package, "id">
): Promise<Package> => {
    const formData = new FormData();

    // Append the image file or URL to the form data
    if (pkg.image_url instanceof File) {
        formData.append("image", pkg.image_url);
    } else {
        formData.append("image_url", pkg.image_url);
    }

    // Append other package properties to the form data
    Object.entries(pkg).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
        }
    });

    const response = await api.post(`/packages/`, formData);

    if (response.status !== 201) {
        throw new Error("Failed to add package");
    }
    return response.data;
};

// Fetch packages with pagination from the API
export const getPackagesWithPagination = async (
    page = 1,
    limit = 10
): Promise<{
    packages: Package[];
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        totalRecords: number;
    };
}> => {
    const response = await api.get(`/packages/?page=${page}&limit=${limit}`
    );
    if (response.status !== 200) {
        throw new Error("Failed to fetch packages with pagination");
    }
    const data = await response.data;
    return {
        packages: data.packages,
        pagination: data.pagination,
    };
};

// Update an existing package in the API
export const updatePackage = async (
    id: number,
    pkg: Omit<Package, "id">
): Promise<Package> => {
    const formData = new FormData();

    // Append the image file or URL to the form data
    if (pkg.image_url instanceof File) {
        formData.append("image", pkg.image_url);
    } else {
        formData.append("image_url", pkg.image_url);
    }

    // Append other package properties to the form data
    Object.entries(pkg).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
        }
    });

    const response = await api.put(`/packages/${id}/`, formData);
    if (response.status !== 200) {
        throw new Error("Failed to update package");
    }
    return response.data;
};

// Delete a package from the API
export const deletePackage = async (id: number): Promise<void> => {
    const response = await api.delete(`/packages/${id}/`);

    if (response.status !== 200) {
        throw new Error("Failed to delete package");
    }
};

export const publishPackage = async(id: number, published: { published: string }): Promise<Package> => {
    const data = JSON.stringify(published);
    const response = await api.post(`/packages/published/${id}`,data,{
        headers:{
            "Content-Type":"application/json"
        }
    });
    if(response.status !== 200){
        console.log(response)
        throw new Error("Failed to publish package")
    }

    return response.data;
}