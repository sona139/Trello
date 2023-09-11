const db = require("../config/db");
const { DataTypes } = require("sequelize");

const Card = db.define(
	"card",
	{
		title: {
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

module.exports = Card;
