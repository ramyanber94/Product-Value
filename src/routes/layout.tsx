import {
  $,
  component$,
  Slot,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
import Navbar from "~/components/shared/navbar";
import { VehicleContext } from "~/context/vehicle";
import type { VehiclesInterface } from "~/interfaces/vehicles-interface";

export const onRequest: RequestHandler = ({ locale, params, redirect }) => {
  const { lang } = params;
  if (!lang) throw redirect(302, "/en");
  const supportedLocales = ["en", "es", "fr", "ar"]; // Example locales
  if (!supportedLocales.includes(lang)) throw redirect(302, "/en");
  locale(lang); // Set the locale based on the URL parameter
  if (!locale()) throw redirect(302, "/en");
};

export default component$(() => {
  const selectedLanguage = useSignal<string>("en");

  const vehicle = useSignal<VehiclesInterface>({
    make: "",
    model: "",
    year: 0,
    trim: "",
    body: "",
    engine: "",
    hp: "",
    seats: "",
    fuel: "",
    transmission: "",
    drive: "",
    doors: "",
    vin: "",
  });
  useContextProvider(VehicleContext, vehicle);
  // ge

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const lang = window.location.pathname.split("/")[1];
    selectedLanguage.value = lang;
  });
  const onLanguageChange = $(async (lang: string) => {
    window.location.href = `/${lang}`;
  });

  return (
    <>
      <Navbar
        onLanguageChange={onLanguageChange}
        selectedLanguage={selectedLanguage.value}
      />
      <Slot />
    </>
  );
});
