import { VehiclesInterface } from "~/interfaces/vehicles-interface";
import sequelize from "../dbConnection";
import { DataTypes, Model, ModelStatic } from "sequelize";

const ScrapedVehicle: ModelStatic<Model<VehiclesInterface>> = sequelize.define("ScrapedVehicle", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    make: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    trim: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    market_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    vin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'scrapedvehicle',
    schema: 'dbo',
});

sequelize.sync({ force: false }) // Set force to true if you want to drop the table first
    .then(() => {
        console.log("The ScrapedVehicle table has been created (or already exists).");
    })
    .catch((error: any) => {
        console.error("Error creating table: ", error);
    });

export default ScrapedVehicle;
