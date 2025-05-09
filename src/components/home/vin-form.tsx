import type { QRL, Signal } from "@builder.io/qwik";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";

export const getMakes = server$(async () => {
  const res = await fetch("https://www.carqueryapi.com/api/0.3/?cmd=getMakes");
  const data = await res.json();

  const makes = data.Makes?.map((m: any) => m.make_display)
    .filter((name: string) => /^[A-Za-z ]{2,30}$/.test(name))
    .sort((a: string, b: string) => a.localeCompare(b));

  return Array.from(new Set(makes)) as string[];
});

export interface VinFormProps {
  handleVinDecode: QRL<() => Promise<void>>;
  handleMakeModelSearch: QRL<
    (make: string, model: string, year: number) => Promise<void>
  >;
  vinNumber: Signal<string>;
  isLoading: Signal<boolean>;
}

export default component$<VinFormProps>((props) => {
  const { handleVinDecode, handleMakeModelSearch, vinNumber, isLoading } =
    props;
  const t = inlineTranslate();

  const make = useSignal("");
  const model = useSignal("");
  const year = useSignal("");
  const makes = useSignal<string[]>([]);
  const models = useSignal<string[]>([]);

  const mode = useSignal<"vin" | "manual">("vin");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    makes.value = await getMakes();
  });

  const getModels = server$(async (selectedMake: string) => {
    const res = await fetch(
      `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${selectedMake}`
    );
    const data = await res.json();
    const raw = data.Models || [];

    return raw
      .map((m: any) => m.model_name)
      .filter((name: string) => /^[A-Za-z0-9\- ]{2,30}$/.test(name))
      .sort((a: string, b: string) => a.localeCompare(b));
  });

  return (
    <div class="bg-gold-500 shadow-md rounded-lg p-6 max-w-md w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
      <h1 class="text-2xl font-bold text-center text-gold-900">
        {t("form.title")}
      </h1>

      <p class="text-center text-gold-900">{t("form.description")}</p>

      <div class="flex justify-center gap-4 mt-4">
        <button
          class={`px-4 py-2 rounded-lg font-bold ${mode.value === "vin" ? "bg-gold-900 text-white" : "bg-white text-gold-900 border border-gold-900"}`}
          onClick$={() => (mode.value = "vin")}
        >
          By VIN
        </button>
        <button
          class={`px-4 py-2 rounded-lg font-bold ${mode.value === "manual" ? "bg-gold-900 text-white" : "bg-white text-gold-900 border border-gold-900"}`}
          onClick$={() => (mode.value = "manual")}
        >
          By Make/Model/Year
        </button>
      </div>

      {mode.value === "vin" ? (
        <div class="flex flex-col items-center justify-center mt-4 gap-3">
          <input
            type="text"
            class="border border-gold-900 rounded-lg p-2 w-full text-gold-900 placeholder:text-gold-900"
            placeholder="Enter VIN number"
            value={vinNumber.value}
            onInput$={(e, el) => {
              el.value = el.value.toUpperCase().slice(0, 17);
              vinNumber.value = el.value;
            }}
          />

          <button
            class="bg-gold-900 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500"
            disabled={isLoading.value}
            onClick$={handleVinDecode}
          >
            {isLoading.value ? "Loading..." : "Get Market Value"}
          </button>
        </div>
      ) : (
        <div class="flex flex-col items-center justify-center mt-4 gap-3 w-full">
          <select
            class="border border-gold-900 rounded-lg p-2 w-full text-gold-900"
            onChange$={async (e: any) => {
              make.value = e.target.value;
              models.value = await getModels(make.value);
            }}
          >
            <option value="">Select Make</option>
            {makes.value.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {make.value && (
            <select
              class="border border-gold-900 rounded-lg p-2 w-full text-gold-900"
              onChange$={(e: any) => (model.value = e.target.value)}
            >
              <option value="">Select Model</option>
              {models.value.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            class="border border-gold-900 rounded-lg p-2 w-full text-gold-900 placeholder:text-gold-900"
            placeholder="Enter Year (e.g. 2020)"
            onInput$={(e: any) => (year.value = e.target.value)}
          />

          <button
            class="bg-gold-900 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500"
            onClick$={() =>
              handleMakeModelSearch(
                make.value,
                model.value,
                parseInt(year.value)
              )
            }
          >
            {isLoading.value ? "Loading..." : "Get Market Value"}
          </button>
        </div>
      )}
    </div>
  );
});
