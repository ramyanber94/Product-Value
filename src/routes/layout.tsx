import {
  component$,
  Slot,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import Navbar from "~/components/shared/navbar";
import { VehicleContext } from "~/context/vehicle";
import type { VehiclesInterface } from "~/interfaces/vehicles-interface";

export default component$(() => {
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

  return (
    <>
      <Navbar />
      <Slot />
    </>
  );
});

export const onRequest: RequestHandler = ({ locale, params, redirect }) => {
  const { lang } = params;
  if (!lang) throw redirect(302, "/en");
  const supportedLocales = ["en", "es", "fr", "ar"]; // Example locales
  if (!supportedLocales.includes(lang)) throw redirect(302, "/en");
  locale(lang); // Set the locale based on the URL parameter
  if (!locale()) throw redirect(302, "/en");
};
