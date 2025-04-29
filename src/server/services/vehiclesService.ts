import { VehiclesInterface } from "~/interfaces/vehicles-interface";
import { PrismaClient } from '@prisma/client'


export const addVehiclesToDB = async (vehiclesList: VehiclesInterface) => {
    const prisma = new PrismaClient()

    try {
        const existingVehicle = await prisma.vehicle.findUnique({
            where: {
                vin: vehiclesList.vin,
            },
        });

        if (existingVehicle) {
            return { success: true, data: existingVehicle };
        } else {
            if (!vehiclesList.make || !vehiclesList.model || !vehiclesList.year) {
                return { success: false, message: "Make, model, and year are required." };
            }
        }

        const newVehicle = await prisma.vehicle.create({
            data: {
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
        });

        return { success: true, data: newVehicle };
    } catch (error: any) {
        console.error("Error adding vehicle to database:", error.message);
        return { success: false, message: error.message };
    }
}

export const checkVehicleInDB = async (vin: string) => {
    debugger;
    const prisma = new PrismaClient()

    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: {
                vin: vin,
            },
        });

        if (vehicle) {
            return { success: true, data: vehicle };
        } else {
            return { success: false, message: "Vehicle not found." };
        }
    } catch (error: any) {
        console.error("Error checking vehicle in database:", error.message);
        return { success: false, message: error.message };
    }
}