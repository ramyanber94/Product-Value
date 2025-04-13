import axios from "axios";
import Vehicles from "../models/Vehicle";

export const decodeByVinDecoderz = async (vin: string) => {
    try {
        const checkInDatabase = await checkVinInDatabase(vin);
        if (checkInDatabase.success) {
            return { success: true, data: checkInDatabase.data };
        }
        console.log(`${import.meta.env.VITE_MODEL_API_URL}/extract_info`)
        const req = await axios.post(
            `${import.meta.env.VITE_MODEL_API_URL}/extract_info`,
            {
                url: 'https://vehiclereport.me/get-report',
                vin: vin
            },
        )
        const response = req.data;
        if (response.success) {
            return { success: true, data: response.data };
        } else {
            console.error("Error in response:", response);
            return { success: false, message: response.message };
        }
    }
    catch (error: any) {
        console.error("Error fetching data:", error);
        return { success: false, message: error.message };
    }
}

export const checkVinInDatabase = async (vin: string) => {
    try {
        const vehicle = await Vehicles.findOne({ where: { vin } });
        if (vehicle) {
            return { success: true, data: vehicle.toJSON() };
        } else {
            return { success: false, message: "VIN not found in database" };
        }
    } catch (error: any) {
        console.error("Error checking VIN in database:", error);
        return { success: false, message: error.message };
    }
}


