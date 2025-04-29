import {
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { VehicleContext } from "~/context/vehicle";
import HeroImage from "~/assets/heroImage.jpg?jsx";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const vehicleContext = useContext(VehicleContext);
  const finalMarketValue = useSignal<string>("");
  const nav = useNavigate();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (
      !(
        vehicleContext.value.make &&
        vehicleContext.value.model &&
        vehicleContext.value.year
      )
    ) {
      nav("/en");
    }
  });

  return (
    <div class="flex flex-col items-center justify-start min-h-screen bg-black gap-4">
      <div class="flex items-center justify-center w-full">
        <HeroImage
          class="w-full h-[80vh] object-cover rounded-lg shadow-lg"
          alt="Hero Image"
        />
      </div>
      <div class="absolute top-0 left-0 right-0 z-10 flex items-center justify-center w-full h-[80vh] flex-col gap-3">
        <table class="mt-10 w-full max-w-4xl bg-black shadow-md rounded-lg border border-gray-800 text-amber-50">
          <caption class="text-lg font-bold text-center p-4">
            VIN Decode Result
          </caption>
          <thead class="bg-gray-700">
            <tr class="border border-gray-800">
              <th class="border border-gray-800 px-4 py-2">Make</th>
              <th class="border border-gray-800 px-4 py-2">Model</th>
              <th class="border border-gray-800 px-4 py-2">Year</th>
              <th class="border border-gray-800 px-4 py-2">Trim</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-800 px-4 py-2 text-center">
                {vehicleContext.value.make?.toLowerCase().includes("select")
                  ? "N/A"
                  : vehicleContext.value.make}
              </td>
              <td class="border border-gray-800 px-4 py-2 text-center">
                {vehicleContext.value.model?.toLowerCase().includes("select")
                  ? "N/A"
                  : vehicleContext.value.model}
              </td>
              <td class="border border-gray-800 px-4 py-2 text-center">
                {vehicleContext.value.year?.toString().includes("select")
                  ? "N/A"
                  : vehicleContext.value.year}
              </td>
              <td class="border border-gray-800 px-4 py-2 text-center">
                {vehicleContext.value.trim?.toLowerCase().includes("select")
                  ? "N/A"
                  : vehicleContext.value.trim}
              </td>
            </tr>
          </tbody>
        </table>

        {vehicleContext.value.body &&
          vehicleContext.value.engine &&
          vehicleContext.value.hp &&
          vehicleContext.value.fuel &&
          vehicleContext.value.transmission && (
            <div class="mt-10 w-full overflow-x-auto flex flex-col items-center justify-center">
              <p class="text-lg font-bold text-center p-4 sticky left-0 right-0 z-10 text-amber-50">
                More Details
              </p>
              <table
                class="table-auto overflow-scroll w-full max-w-4xl bg-black shadow-md rounded-lg border border-gray-800 
                m-[0 auto] text-amber-50"
              >
                <thead class="bg-gray-700">
                  <tr class="border border-gray-800">
                    <th class="border border-gray-800 px-4 py-2">Body Type</th>
                    <th class="border border-gray-800 px-4 py-2">
                      Engine Size
                    </th>
                    <th class="border border-gray-800 px-4 py-2">Hp</th>
                    <th class="border border-gray-800 px-4 py-2">Seats</th>
                    <th class="border border-gray-800 px-4 py-2">Fuel</th>
                    <th class="border border-gray-800 px-4 py-2">
                      Transmission
                    </th>
                    <th class="border border-gray-800 px-4 py-2">Drive Type</th>
                    <th class="border border-gray-800 px-4 py-2">Doors</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-800 px-4 py-2 text-center">
                      {vehicleContext.value.body}
                    </td>
                    <td class="border border-gray-800 px-4 py-2 text-center">
                      {vehicleContext.value.engine}
                    </td>
                    <td class="border border-gray-800 px-4 py-2 text-center">
                      {vehicleContext.value.hp}
                    </td>
                    <td class="border border-gray-800 px-4 py-2 text-center">
                      {vehicleContext.value.seats}
                    </td>
                    <td class="border border-gray-800 px-4 py-2 text-center">
                      {vehicleContext.value.fuel}
                    </td>
                    <td class="border border-gray-800 px-4 py-2 text-center">
                      {vehicleContext.value.transmission}
                    </td>
                    <td class="border border-gray-800 px-4 py-2 text-center">
                      {vehicleContext.value.drive}
                    </td>
                    <td class="border border-gray-800 px-4 py-2 text-center">
                      {vehicleContext.value.doors}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {finalMarketValue.value && (
          <div class="mt-10 w-full max-w-4xl bg-black shadow-md rounded-lg p-6 text-amber-50">
            <h2 class="text-xl font-bold text-center">Market Value</h2>
            <p class="text-gray-600 text-center mt-2">
              {finalMarketValue.value}
            </p>
            <p class="text-gray-600 text-center mt-2">
              The market value is based on the current year and the average
              market value in Egypt.
            </p>
            <p class="text-gray-600 text-center mt-2">
              Please note that the market value may vary based on the condition
              of the car and other factors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
