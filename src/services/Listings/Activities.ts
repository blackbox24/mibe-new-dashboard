import { string } from 'zod';
import {api,base_url} from '../apiConfig';

export interface Activity {
  id: number;
  name: string;
  published: string;
  destination_id: number | string;
  description?: string;
  price: number;
  duration?: string;
  dest_name:string;
  image_url?: File | string;
}

export const getActivitiesWithPagination = async (
  page:number =1, 
  limit: number = 10
): Promise<{
  activities: Activity[];
  pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalRecords: number;
  };
}> => {
  const response = await api.get(`/activities/?page=${page}&limit=${limit}`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch activities');
  }
  const data = await response.data;
  return {
    activities: data.activities,
    pagination: data.pagination,
  };
};

export const addActivity = async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
  const formData = new FormData();
  formData.append('image', activity.image_url as File);
  Object.entries(activity).forEach(([key, value]) => {
    if (key !== 'image_url' && value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await api.post(`/activities/`, formData);
  if (response.status !== 201) {
    throw new Error('Failed to add activity');
  }
  return response.data;
};

export const updateActivity = async (id: number, activity: Partial<Activity>): Promise<Activity> => {
  const formData = new FormData();
  formData.append('image', activity.image_url as File);
  Object.entries(activity).forEach(([key, value]) => {
    if (key !== 'image_url' && value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await api.put(`/activities/${id}`, formData);
  if (response.status !== 200) {
    throw new Error('Failed to update activity');
  }
  return response.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  const response = await api.delete(`/activities/${id}`);
  if (response.status !== 200) {
    throw new Error('Failed to delete activity');
  }
};

export const publishActivity = async(id: number, published: { published: string }): Promise<Activity> => {
    const data = JSON.stringify(published);
    const response = await api.post(`/activities/published/${id}`,data,{
        headers:{
            "Content-Type":"application/json"
        }
    });
    if(response.status !== 200){
        console.log(response)
        throw new Error("Failed to publish activity")
    }

    return response.data;
}
