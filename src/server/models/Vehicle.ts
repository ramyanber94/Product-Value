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
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('make', undefined);
            }
        }
    },
    model: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('model', undefined);
            }
        }
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        set(value: number) {
            if (value && value.toString().toLowerCase().includes('select')) {
                this.setDataValue('year', undefined);
            }
            // check if the year is a valid number
            if (value && !isNaN(value)) {
                this.setDataValue('year', value);
            } else {
                this.setDataValue('year', undefined);
            }
        }
    },
    trim: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('trim', undefined);
            }
        }
    },
    body: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('body', undefined);
            }
        }
    },
    hp: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('hp', undefined);
            }
        }
    },
    vin: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
    },
    fuel: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('fuel', undefined);
            }
        }
    },
    engine: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('engine', undefined);
            }
        }
    },
    transmission: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('transmission', undefined);
            }
        }
    },
    seats: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            if (value && value.toLowerCase().includes('select')) {
                this.setDataValue('seats', undefined);
            }
        }

    },
    doors: {
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