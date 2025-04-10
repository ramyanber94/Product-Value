import { VehiclesInterface } from "~/interfaces/vehicles-interface";
import Vehicles from "~/server/models/Vehicle";

export const addVehiclesToDB = async (vehiclesList: VehiclesInterface) => {
    try {
        const addList = await Vehicles.findOrCreate(
            {
                where: {
                    vin: vehiclesList.vin,
                },
                defaults: {
                    make: vehiclesList.make,
                    model: vehiclesList.model,
                    year: vehiclesList.year,
                    trim: vehiclesList.trim,
                    body: vehiclesList.body,
                    hp: vehiclesList.hp,
                    vin: vehiclesList.vin,
                    fuel: vehiclesList.fuel,
                    engine: vehiclesList.engine,
                    transmission: vehiclesList.transmission,
                    drive: vehiclesList.drive,
                },
            }
        );
        return addList;
    } catch (error: any) {
        console.log(error.message);
    }
}