const db = require("../config/db");
const { DataTypes } = require("sequelize");

const Item = db.define(
	"item",
	{
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		rank: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{ timestamps: false, freezeTableName: true }
);

module.exports = Item;
