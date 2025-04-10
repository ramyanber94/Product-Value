import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { server$, type DocumentHead } from "@builder.io/qwik-city";
import { decodeByVinDecoderz } from "~/server/services/decodeService";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { addVehiclesToDB } from "~/server/services/vehiclesService";

const MarketValueAverage = z.object({
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  average: z.number(),
  currency: z.string(),
});

export const fetchContactCars = server$(async (vin: string) => {
  try {
    const req = await decodeByVinDecoderz(vin);
    let data = "";
    if (req.success) {
      const prompt = `What is the max market value and min market value and average market value of a ${req.data.year} ${req.data.make} ${req.data.model} ${req.data.trim} in Egypt in ${
        // current year
        new Date().getFullYear()
      }?
      Response format json {price: "1000", currency: "EGP"}
      `;
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_SECRET_KEY,
      });
      try {
        const response = await client.responses.create({
          model: "gpt-4o-mini",
          tools: [{ type: "web_search_preview" }],
          input: prompt,
          temperature: 0,
        });
        data = response.output_text;
      } catch (error: any) {
        console.error("Error fetching data from OpenAI:", error.message);
      }

      const saveData = await addVehiclesToDB({
        make: req.data.make,
        model: req.data.model,
        year: req.data.year,
        trim: req.data.trim,
        body: req.data.body,
        hp: req.data.hp,
        vin: vin,
        fuel: req.data.fuel,
        engine: req.data.engine,
        transmission: req.data.transmission,
        drive: req.data.driveTrain,
      });

      if (!saveData) {
        console.error("Error saving data to database");
      }

      const cleanPrompt = `
      From the following text, extract the JSON object:
      ${data}
      ** If the text does not contain a JSON object, return an empty array.
      ** If min and max are equal to each other, return null for min and max.
      `;

      try {
        const response2 = await client.beta.chat.completions.parse({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: cleanPrompt,
            },
          ],
          response_format: zodResponseFormat(MarketValueAverage, "average"),
        });
        const marketValue: any = response2.choices[0].message.content;

        const jsonMarketValue = JSON.parse(marketValue);
        console.log("jsonMarketValue", jsonMarketValue);
        req.data.marketValue = {
          minPrice: jsonMarketValue.minPrice,
          maxPrice: jsonMarketValue.maxPrice,
          average: jsonMarketValue.average,
          currency: jsonMarketValue.currency,
        };
        console.log("req.data", req.data);
        req.data.success = true;
      } catch (error: any) {
        console.error("Error parsing response:", error.message);
      }

      return JSON.stringify({ success: true, data: req.data });
    }
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return JSON.stringify({ success: false, message: error.message });
  }
});

export default component$(() => {
  const isLoading = useSignal<boolean>(false);
  const vinNumber = useSignal<string>("");
  const vinDecodeResult = useSignal<any>(null);
  const finalMarketValue = useSignal<string>("");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => vinDecodeResult.value);
    if (!vinDecodeResult.value) return;
    const marketValue = vinDecodeResult.value?.marketValue;
    // check if minPrice and maxPrice and average are equal to each other

    if (marketValue?.minPrice && marketValue?.maxPrice) {
      finalMarketValue.value = `The market value of the car is between ${parseFloat(
        marketValue.minPrice
      ).toLocaleString("en-US", {
        style: "currency",
        currency: marketValue.currency,
      })} and ${parseFloat(marketValue.maxPrice).toLocaleString("en-US", {
        style: "currency",
        currency: marketValue.currency,
      })}. 
      The average market value is ${parseFloat(
        marketValue.average
      ).toLocaleString("en-US", {
        style: "currency",
        currency: marketValue.currency,
      })}.`;
    } else {
      finalMarketValue.value = `The market value of the car is ${parseFloat(
        marketValue.average
      ).toLocaleString("en-US", {
        style: "currency",
        currency: marketValue.currency,
      })}.`;
    }
  });

  return (
    <div class="flex flex-col items-center justify-start p-10 min-h-screen bg-gray-100 gap-4">
      <div class="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 class="text-2xl font-bold text-center">
          VIN Decoder & Market Value
        </h1>

        <p class="text-gray-600 text-center mt-2">
          Enter a VIN number to decode and get the market value. Exclusive for
          GCC
        </p>

        <div class="flex flex-col items-center justify-center mt-4 gap-3">
          <input
            type="text"
            class="border border-gray-300 rounded-lg p-2 mt-4 w-full"
            placeholder="Enter VIN number"
            value={vinNumber.value}
            onInput$={(e: any, el: any) => {
              // capitalize all letters
              el.value = el.value.toUpperCase();
              // make sure the value is 17 characters
              if (el.value.length > 17) {
                el.value = el.value.slice(0, 17);
              }
              vinNumber.value = el.value;
            }}
          />
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick$={async () => {
              vinDecodeResult.value = null;
              isLoading.value = true;
              const req = await fetchContactCars(vinNumber.value);
              const jsonResponse = JSON.parse(req ?? "{}");
              if (jsonResponse.success) {
                vinDecodeResult.value = jsonResponse.data;
              }
              isLoading.value = false;
            }}
          >
            Run Contact Cars Cron
          </button>
        </div>
      </div>

      {vinDecodeResult.value && (
        <>
          <table class="mt-10 w-full max-w-4xl bg-white shadow-md rounded-lg border border-gray-200">
            <caption class="text-lg font-bold text-center p-4">
              VIN Decode Result
            </caption>
            <thead class="bg-gray-100">
              <tr class="border border-gray-200">
                <th class="border border-gray-200 px-4 py-2">Make</th>
                <th class="border border-gray-200 px-4 py-2">Model</th>
                <th class="border border-gray-200 px-4 py-2">Year</th>
                <th class="border border-gray-200 px-4 py-2">Trim</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-200 px-4 py-2 text-center">
                  {vinDecodeResult.value.make.toLowerCase().includes("select")
                    ? "N/A"
                    : vinDecodeResult.value.make}
                </td>
                <td class="border border-gray-200 px-4 py-2 text-center">
                  {vinDecodeResult.value.model.toLowerCase().includes("select")
                    ? "N/A"
                    : vinDecodeResult.value.model}
                </td>
                <td class="border border-gray-200 px-4 py-2 text-center">
                  {vinDecodeResult.value.year.includes("select")
                    ? "N/A"
                    : vinDecodeResult.value.year}
                </td>
                <td class="border border-gray-200 px-4 py-2 text-center">
                  {vinDecodeResult.value.trim.includes("select")
                    ? "N/A"
                    : vinDecodeResult.value.trim}
                </td>
              </tr>
            </tbody>
          </table>

          {vinDecodeResult.value.body &&
            vinDecodeResult.value.engine &&
            vinDecodeResult.value.hp &&
            vinDecodeResult.value.seats &&
            vinDecodeResult.value.fuel &&
            vinDecodeResult.value.transmission && (
              <table class="mt-10 w-full max-w-4xl bg-white shadow-md rounded-lg border border-gray-200">
                <caption class="text-lg font-bold text-center p-4">
                  More Details
                </caption>
                <thead class="bg-gray-100">
                  <tr class="border border-gray-200">
                    <th class="border border-gray-200 px-4 py-2">Body Type</th>
                    <th class="border border-gray-200 px-4 py-2">
                      Engine Size
                    </th>
                    <th class="border border-gray-200 px-4 py-2">Hp</th>
                    <th class="border border-gray-200 px-4 py-2">Seats</th>
                    <th class="border border-gray-200 px-4 py-2">Fuel</th>
                    <th class="border border-gray-200 px-4 py-2">
                      Transmission
                    </th>
                    <th class="border border-gray-200 px-4 py-2">Drive Type</th>
                    <th class="border border-gray-200 px-4 py-2">Doors</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                      {vinDecodeResult.value.body}
                    </td>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                      {vinDecodeResult.value.engine}
                    </td>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                      {vinDecodeResult.value.hp}
                    </td>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                      {vinDecodeResult.value.seats}
                    </td>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                      {vinDecodeResult.value.fuel}
                    </td>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                      {vinDecodeResult.value.transmission}
                    </td>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                      {vinDecodeResult.value.driveTrain}
                    </td>
                    <td class="border border-gray-200 px-4 py-2 text-center">
                      {vinDecodeResult.value.doors}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

          {vinDecodeResult.value.make &&
            vinDecodeResult.value.model &&
            vinDecodeResult.value.year && (
              <div class="mt-10 w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
                <h2 class="text-xl font-bold text-center">Market Value</h2>
                <p class="text-gray-600 text-center mt-2">
                  {finalMarketValue.value}
                </p>
                <p class="text-gray-600 text-center mt-2">
                  The market value is based on the current year and the average
                  market value in Egypt.
                </p>
                <p class="text-gray-600 text-center mt-2">
                  Please note that the market value may vary based on the
                  condition of the car and other factors.
                </p>
              </div>
            )}
        </>
      )}

      {/* create a beautifull loader in middle of the screen */}
      {isLoading.value && (
        <div class="flex items-center justify-center mt-10 absolute inset-0">
          <svg
            class="animate-spin h-10 w-10 text-blue-500 
            transition-transform duration-500 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke-width="4"
              stroke="currentColor"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
            />
          </svg>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
