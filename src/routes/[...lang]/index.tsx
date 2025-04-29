import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import VinForm from "~/components/home/vin-form";
import HeroImage from "~/assets/heroImage.jpg?jsx";
import { addVehiclesToDB } from "~/server/services/vehiclesService";
import { decodeByVinDecoderz } from "~/server/services/decodeService";
import { server$, useNavigate } from "@builder.io/qwik-city";
import type { VehiclesInterface } from "~/interfaces/vehicles-interface";
import { VehicleContext } from "~/context/vehicle";

export const fetchContactCars = server$(async function (vin: string) {
  try {
    const req = await decodeByVinDecoderz(vin);

    const saveData = await addVehiclesToDB({
      make: req.data.make,
      model: req.data.model,
      year: parseInt(req.data?.year ?? "2020"),
      trim: req.data.trim,
      body: req.data.body,
      seats: req.data.seats,
      doors: req.data.doors,
      hp: req.data.hp,
      vin: vin,
      fuel: req.data.fuel,
      engine: req.data.engine,
      transmission: req.data.transmission,
      drive: req.data.driveTrain,
    });

    if (!saveData.success) {
      console.error("Error saving data to database:", saveData.message);
    }
    if (
      req.data.make.toLowerCase().includes("select") ||
      req.data.model.toLowerCase().includes("select") ||
      req.data.year.toString().includes("select")
    ) {
      return JSON.stringify({ success: true, data: saveData.data });
    }
    if (req.success) {
      return JSON.stringify({ success: true, data: req.data });
    }
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return JSON.stringify({ success: false, message: error.message });
  }
});

export default component$(() => {
  const vinNumber = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);
  const nav = useNavigate();
  const vehicleContext = useContext(VehicleContext);

  const handleVinDecode = $(async () => {
    isLoading.value = true;
    const req = await fetchContactCars(vinNumber.value);
    const response = JSON.parse(req ?? "{}");
    if (response.success) {
      console.log(response);
      vehicleContext.value = response.data as VehiclesInterface;
      nav("vin");
    } else {
      console.error("Error decoding VIN:", response.message);
    }
    isLoading.value = false;
  });

  return (
    <>
      <div class="flex flex-col items-center justify-start min-h-screen bg-black gap-4">
        <div class="flex items-center justify-center w-full">
          <HeroImage
            class="w-full h-[80vh] object-cover rounded-lg shadow-lg"
            alt="Hero Image"
          />
        </div>
        <VinForm
          handleVinDecode={handleVinDecode}
          vinNumber={vinNumber}
          isLoading={isLoading}
        />
      </div>
    </>
  );
});
