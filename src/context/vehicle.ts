import type { Signal } from "@builder.io/qwik";
import { createContextId } from "@builder.io/qwik";
import type { VehiclesInterface } from "~/interfaces/vehicles-interface";

export const VehicleContext = createContextId<Signal<VehiclesInterface>>(
    'docs.theme-context'
);