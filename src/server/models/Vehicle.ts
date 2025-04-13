import { VehiclesInterface } from "~/interfaces/vehicles-interface";
import sequelize from "../dbConnection";
import { DataTypes, Model, ModelStatic } from "sequelize";

// Enhanced model definition
const Vehicles: ModelStatic<Model<VehiclesInterface>> = sequelize.define("vehicles", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        validate: {
            isInt: true
        }
    },
    make: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string | null) {
            if (!value) {
                this.setDataValue('make', undefined);
                return;
            }
            const val = value.trim();
            if (val.toLowerCase().includes('select')) {
                throw new Error('Potential SQL injection detected');
            }
            this.setDataValue('make', val);
        }
    },
    model: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string | null) {
            if (!value) {
                this.setDataValue('model', undefined);
                return;
            }
            const val = value.trim();
            if (val.toLowerCase().includes('select')) {
                throw new Error('Potential SQL injection detected');
            }
            this.setDataValue('model', val);
        }
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1900,
            max: new Date().getFullYear() + 1
        },
        set(value: number | string | null) {
            if (value === null || value === undefined || value === '') {
                this.setDataValue('year', undefined);
                return;
            }

            const numValue = typeof value === 'string' ? parseInt(value) : value;

            if (isNaN(numValue)) {
                throw new Error('Year must be a valid number');
            }

            if (value.toString().toLowerCase().includes('select')) {
                throw new Error('Potential SQL injection detected');
            }

            this.setDataValue('year', numValue);
        }
    },
    vin: {
        type: DataTypes.STRING(17), // Standard VIN length is 17
        allowNull: false, // Should never be null
        unique: true,
        validate: {
            len: [17, 17], // Exactly 17 characters
            notEmpty: true
        },
        set(value: string) {
            if (!value || value.length !== 17) {
                throw new Error('VIN must be exactly 17 characters');
            }
            this.setDataValue('vin', value.toUpperCase()); // Standardize to uppercase
        }
    },
    // Other fields with similar enhancements...
    engine: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value: string | null) {
            if (!value) {
                this.setDataValue('engine', undefined);
                return;
            }
            const val = value.trim();
            if (val.toLowerCase().includes('select')) {
                throw new Error('Potential SQL injection detected');
            }
            this.setDataValue('engine', val);
        }
    },
    // Add indexes for frequently queried fields
    indexFields: {
        type: DataTypes.VIRTUAL,
        get() {
            return {
                vinIndex: this.getDataValue('vin')
            };
        }
    }
}, {
    timestamps: true,
    tableName: 'vehicles',
    schema: 'dbo',
    // Additional model options
    paranoid: false, // Set to true if you want soft deletes
    underscored: false, // Set to true if you prefer snake_case
    freezeTableName: true, // Prevent pluralization
    validate: {
        // Model-wide validation
        validateYearWithMake() {
            if (this.year && !this.make) {
                throw new Error('Make is required when year is specified');
            }
        }
    },
    indexes: [
        {
            unique: true,
            fields: ['vin'],
            name: 'idx_vehicles_vin_unique'
        },
        {
            fields: ['make', 'model'],
            name: 'idx_vehicles_make_model'
        }
    ]
});

// Add hooks for additional control
Vehicles.addHook('beforeValidate', (vehicle: Model<VehiclesInterface>) => {
    // Additional pre-validation logic
    if (vehicle.toJSON().vin) {
        vehicle.toJSON().vin = vehicle?.toJSON()?.vin?.trim()?.toUpperCase();
    }
});

Vehicles.addHook('afterCreate', (vehicle: Model<VehiclesInterface>) => {
    console.log(`New vehicle created with VIN: ${vehicle.toJSON().vin}`);
});


export default Vehicles;