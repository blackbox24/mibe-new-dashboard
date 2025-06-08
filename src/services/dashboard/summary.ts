import apiConfig from "../apiConfig";

export interface Stats {
    title: string;
    value: number;
    change: number;
    changeType: "increase" | "decrease";
    icon: string;
}


export interface SummaryData {
    month: string;
    revenue: number;
    bookings: number;
};


export const getStats = async (): Promise<Stats[]> => {
    try{
        const response = await fetch(`${apiConfig.baseurl}/dashboard/summary`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching stats: ${response.statusText}`);
        }

        const data = await response.json();
        return data.stats as Stats[];
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        throw error; 
    }
};

export const getRevenue = async (): Promise<SummaryData[]> => {
    try{
        const response = await fetch(`${apiConfig.baseurl}/dashboard/revenue`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching revenue: ${response.statusText}`);
        }

        const data = await response.json();
        return data.revenue as SummaryData[];
    } catch (error) {
        console.error("Failed to fetch revenue:", error);
        throw error;
    }
};