import useSWR from "swr";

import { api, base_url } from "../services/apiConfig";
import { CulturalEventProp } from "../services/Listings/CulturalEvent";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export const useCulturalEvents = () => {
    const { data, error, isLoading, mutate } = useSWR<CulturalEventProp[]>(`${base_url}travel-inspiration/event`, fetcher);

    return {
        data:data||[],
        isLoading,
        isError: error,
        mutate,
    };
};
