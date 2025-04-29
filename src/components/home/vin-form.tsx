import type { QRL, Signal } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from "qwik-speak";

export interface VinFormProps {
  handleVinDecode: QRL<() => Promise<void>>;
  vinNumber: Signal<string>;
  isLoading: Signal<boolean>;
}

export default component$((props: VinFormProps) => {
  const { handleVinDecode, vinNumber, isLoading } = props;
  const t = inlineTranslate();

  return (
    <div class="bg-gold-500 shadow-md rounded-lg p-6 max-w-md w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h1 class="text-2xl font-bold text-center text-gold-900"></h1>

      <p class="text-gold-900 text-center mt-2">{t("form.byVin.body")}</p>

      <div class="flex flex-col items-center justify-center mt-4 gap-3">
        <input
          type="text"
          class="border border-gold-900 focus:border-gold-500 focus:ring-gold-500 focus:ring-1 rounded-lg p-2 mt-4 w-full *:placeholder:text-gold-900
            text-gold-900 placeholder:text-gold-900"
          placeholder="Enter VIN number"
          value={vinNumber.value}
          onInput$={(e: any, el: any) => {
            el.value = el.value.toUpperCase();
            if (el.value.length > 17) {
              el.value = el.value.slice(0, 17);
            }
            vinNumber.value = el.value;
          }}
        />
        <button
          class="
            bg-gold-900 text-white font-bold py-2 px-4 rounded-lg w-full
            hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50
            transition duration-300 ease-in-out"
          disabled={isLoading.value}
          onClick$={handleVinDecode}
        >
          {isLoading.value ? "Loading..." : "Decode VIN"}
        </button>
      </div>
    </div>
  );
});
