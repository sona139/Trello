const { Sequelize } = require("../config/db");
const Card = require("../models/card.model");
const Item = require("../models/item.model");

exports.get = async (req, res, next) => {
	try {
		const { id } = req.params;
		const card = await Card.findAll({
			where: { id },
			include: [{ model: Item }],
			order: [[Item, "rank", "asc"]],
		});

		res.status(200).json(card[0]);
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const cards = await Card.findAll({
			include: [
				{
					model: Item,
				},
			],
			order: [
				["rank", "asc"],
				[Item, "rank", "asc"],
			],
		});

		res.status(200).json(cards);
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.add = async (req, res, next) => {
	try {
		const { title } = req.body;

		const highestRankedCard = await Card.max("rank");

		const rank = highestRankedCard ? highestRankedCard + 1 : 1;

		const card = await Card.create({
			title,
			rank,
		});

		res.status(200).json(card);
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, rank } = req.body;

		if (rank) {
			const cards = await Card.findAll({
				where: {
					rank: { [Sequelize.Op.gte]: rank },
				},
			});

			cards.forEach(async (card) => {
				Card.update({ rank: card.rank + 1 }, { where: { id: card.id } });
			});
		}

		await Card.update({ title, rank }, { where: { id } });

		const card = await Card.findByPk(id);

		res.status(200).json(card);
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.delete = async (req, res, next) => {
	try {
		const { id } = req.params;

		await Card.destroy({ where: { id } });

		res.status(200).json("Delete card sussesfully");
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};
