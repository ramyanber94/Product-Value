import { VehiclesInterface } from "~/interfaces/vehicles-interface";
import sequelize from "../dbConnection";
import { DataTypes, Model, ModelStatic } from "sequelize";

const Vehicles: ModelStatic<Model<VehiclesInterface>> = sequelize.define("vehicles", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    make: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    model: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    trim: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    body: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    hp: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    vin: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
    },
    fuel: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    engine: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    transmission: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    drive: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'vehicles',
    schema: 'dbo',
});

sequelize.sync().then(() => {
    console.log("Vehicles table created successfully!");
}).catch((error) => {
    console.error("Error creating Vehicles table:", error);
});

export default Vehicles;