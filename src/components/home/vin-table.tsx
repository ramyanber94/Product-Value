import type { Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { VehiclesInterface } from "~/interfaces/vehicles-interface";

export interface VinTableProps {
  vehicle: VehiclesInterface;
  finalMarketValue: Signal<any | null>;
}

export default component$((props: VinTableProps) => {
  const { vehicle } = props;

  return (
    <>
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
              {vehicle.make?.toLowerCase().includes("select")
                ? "N/A"
                : vehicle.make}
            </td>
            <td class="border border-gray-800 px-4 py-2 text-center">
              {vehicle.model?.toLowerCase().includes("select")
                ? "N/A"
                : vehicle.model}
            </td>
            <td class="border border-gray-800 px-4 py-2 text-center">
              {vehicle.year?.toString().includes("select")
                ? "N/A"
                : vehicle.year}
            </td>
            <td class="border border-gray-800 px-4 py-2 text-center">
              {vehicle.trim?.toLowerCase().includes("select")
                ? "N/A"
                : vehicle.trim}
            </td>
          </tr>
        </tbody>
      </table>

      {vehicle.body &&
        vehicle.engine &&
        vehicle.hp &&
        vehicle.fuel &&
        vehicle.transmission && (
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
                  <th class="border border-gray-800 px-4 py-2">Engine Size</th>
                  <th class="border border-gray-800 px-4 py-2">Hp</th>
                  <th class="border border-gray-800 px-4 py-2">Seats</th>
                  <th class="border border-gray-800 px-4 py-2">Fuel</th>
                  <th class="border border-gray-800 px-4 py-2">Transmission</th>
                  <th class="border border-gray-800 px-4 py-2">Drive Type</th>
                  <th class="border border-gray-800 px-4 py-2">Doors</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-800 px-4 py-2 text-center">
                    {vehicle.body}
                  </td>
                  <td class="border border-gray-800 px-4 py-2 text-center">
                    {vehicle.engine}
                  </td>
                  <td class="border border-gray-800 px-4 py-2 text-center">
                    {vehicle.hp}
                  </td>
                  <td class="border border-gray-800 px-4 py-2 text-center">
                    {vehicle.seats}
                  </td>
                  <td class="border border-gray-800 px-4 py-2 text-center">
                    {vehicle.fuel}
                  </td>
                  <td class="border border-gray-800 px-4 py-2 text-center">
                    {vehicle.transmission}
                  </td>
                  <td class="border border-gray-800 px-4 py-2 text-center">
                    {vehicle.drive}
                  </td>
                  <td class="border border-gray-800 px-4 py-2 text-center">
                    {vehicle.doors}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
    </>
  );
});
