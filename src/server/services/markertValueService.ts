import axios from "axios";
import { checkVehicleInDB } from "./vehiclesService";


export const decodeByVinDecoderz = async (vin: string) => {
    try {
        const checkInDatabase = await checkVehicleInDB(
            vin
        );
        if (checkInDatabase.success) {
            return { success: true, data: checkInDatabase.data };
        }
        const req = await axios.post(
            `${import.meta.env.VITE_MODEL_API_URL}/extract_info`,
            {
                url: import.meta.env.VITE_DECODER_API_URL,
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


