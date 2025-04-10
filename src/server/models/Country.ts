import sequelize from "../dbConnection";
import { DataTypes } from "sequelize";

const Countries = sequelize.define("countries", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'countries',
    schema: 'dbo',
});

export default Countries;