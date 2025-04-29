import Vehicles from "~/server/models/Vehicle";
import _ from "lodash";
import fs from "fs";

export const handleData = async () => {
    try {
        const vehicles = await Vehicles.findAll();
        const vehicleData = vehicles.map(v => v.toJSON());
        const grouped = _.groupBy(vehicleData, 'make');
        const balancedData = Object.values(grouped).flatMap(group => {
            if (group.length > 200) {
                const reducedSize = Math.floor(group.length * 0.7); // Keep 70% of data
                return _.sampleSize(group, reducedSize);
            }
            return group; // Keep small categories unchanged
        });

        const shuffledData = _.shuffle(balancedData);
        fs.writeFileSync('balancedData.csv', Object.keys(shuffledData[0]).join(',') + '\n');
        fs.writeFileSync('balancedData.csv', shuffledData.map((v: any) => Object.values(v).join(',')).join('\n'), { flag: 'a' });
        console.log(`Balanced dataset created with ${shuffledData.length / Object.keys(grouped).length} rows per make.`);

        return shuffledData;
    } catch (error: any) {
        console.log(error.message);
    }
};