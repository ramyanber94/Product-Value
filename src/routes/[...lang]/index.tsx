import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import VinForm from "~/components/home/vin-form";
import HeroImage from "~/assets/heroImage.jpg?jsx";
import { addVehiclesToDB } from "~/server/services/vehiclesService";
import { decodeByVinDecoderz } from "~/server/services/markertValueService";
import { server$ } from "@builder.io/qwik-city";
import type { VehiclesInterface } from "~/interfaces/vehicles-interface";
import { VehicleContext } from "~/context/vehicle";
import VinTable from "~/components/home/vin-table";
import axios from "axios";
import Loader from "~/components/shared/loader";
import { getMarketValueString } from "~/utils/marketValueUtil";

export const fetchVehicleInfo = server$(async function (vin: string) {
  try {
    const req = await decodeByVinDecoderz(vin);
    if (!req.success) {
      console.error("Error in response:", req);
      return JSON.stringify({ success: false, message: req.message });
    }
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
      return JSON.stringify({ success: false, message: saveData.message });
    }
    if (
      req.data.make.toLowerCase().includes("select") ||
      req.data.model.toLowerCase().includes("select") ||
      req.data.year.toString().includes("select")
    ) {
      return JSON.stringify({ success: true, data: saveData.data });
    }

    const marketValueQuestion = `What is the market value of a ${req.data.year} ${req.data.make} ${req.data.model} ${req.data.trim} in Egypt?`;
    const marketValueResponse = await axios.post(
      `${import.meta.env.VITE_MODEL_API_URL}/market_value_ai`,
      {
        question: marketValueQuestion,
      }
    );
    const marketValueData = marketValueResponse.data;
    if (marketValueData.success) {
      req.data.marketValue = marketValueData.data;
    } else {
      console.error("Error fetching market value:", marketValueData?.message);
    }

    return JSON.stringify({ success: true, data: req.data });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return JSON.stringify({ success: false, message: error.message });
  }
});

export const fetchMarketValue = server$(async function (
  make: string,
  model: string,
  year: number
) {
  try {
    const marketValueQuestion = `What is the market value of a ${year} ${make} ${model} in Egypt?`;
    const marketValueResponse = await axios.post(
      `${import.meta.env.VITE_MODEL_API_URL}/market_value_ai`,
      {
        question: marketValueQuestion,
      }
    );
    const marketValueData = marketValueResponse.data;
    if (marketValueData.success) {
      return JSON.stringify({ success: true, data: marketValueData.data });
    } else {
      console.error("Error fetching market value:", marketValueData?.message);
      return JSON.stringify({
        success: false,
        message: marketValueData.message,
      });
    }
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return JSON.stringify({ success: false, message: error.message });
  }
});

export default component$(() => {
  const vinNumber = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);
  const vehicleContext = useContext(VehicleContext);
  const finalMarketValue = useSignal<any | null>(null);
  const marketValue = useSignal<string | null>(null);

  const handleVinDecode = $(async () => {
    isLoading.value = true;
    const req = await fetchVehicleInfo(vinNumber.value);
    const response = JSON.parse(req);
    if (response.success) {
      vehicleContext.value = response.data as VehiclesInterface;
      finalMarketValue.value = response.data.marketValue;
    } else {
      console.error("Error decoding VIN:", response.message);
    }
    isLoading.value = false;
  });

  const handleMakeModelSearch = $(
    async (make: string, model: string, year: number) => {
      isLoading.value = true;
      const req = await fetchMarketValue(make, model, year);
      const response = JSON.parse(req);
      if (response.success) {
        const marketValueRes = response.data;
        marketValue.value = getMarketValueString(marketValueRes);
      } else {
        console.error("Error decoding VIN:", response.message);
      }
      isLoading.value = false;
    }
  );

  return (
    <>
      {/* add the loader component in absolute div*/}
      {isLoading.value && (
        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <div class="flex flex-col items-center justify-start min-h-screen bg-black gap-4">
        <div class="flex items-center justify-center w-full">
          <HeroImage
            class="w-full h-[80vh] object-cover rounded-lg shadow-lg"
            alt="Hero Image"
          />
        </div>
        <VinForm
          handleVinDecode={handleVinDecode}
          handleMakeModelSearch={handleMakeModelSearch}
          vinNumber={vinNumber}
          isLoading={isLoading}
        />
        {vehicleContext.value.make && (
          <VinTable
            vehicle={vehicleContext.value}
            finalMarketValue={finalMarketValue}
          />
        )}

        {marketValue.value && (
          <div class="mt-10 w-full max-w-4xl bg-black shadow-md rounded-lg p-6 text-amber-50">
            <h2 class="text-xl font-bold text-center">Market Value</h2>
            <p class="text-center mt-2">{marketValue.value}</p>
            <p class="text-center mt-2">
              The market value is based on the current year and the average
              market value in Egypt.
            </p>
            <p class="text-center mt-2">
              Please note that the market value may vary based on the condition
              of the car and other factors.
            </p>
          </div>
        )}
      </div>
    </>
  );
});
