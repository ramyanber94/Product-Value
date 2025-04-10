import { getVinsNoFromVinDecoderz } from "./Decoders/vindecorderz";
import cron from "node-cron";

export const crons = [
    {
        name: "VIN Decoderz",
        description: "Fetches VINs from VIN Decoderz.",
        cron: "0 0 * * *", // Every day at midnight
        run: async () => {
            await getVinsNoFromVinDecoderz();
        },
    },
];

// Function to run all crons
export const runCrons = () => {
    crons.forEach((cronJob) => {
        cron.schedule(cronJob.cron, async () => {
            console.log(`Running cron job: ${cronJob.name}`);
            await cronJob.run();
        });
    });
};