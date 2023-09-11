const { Op } = require("sequelize");
const { Sequelize } = require("../config/db");
const Item = require("../models/item.model");

exports.get = async (req, res, next) => {
	try {
		const { id } = req.params;

		const item = await Item.findByPk(id);

		res.status(200).json(item);
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const { cardId } = req.params;

		const items = await Item.findAll(
			{ where: { cardId } },
			{ order: [["rank", "asc"]] }
		);

		res.status(200).json(items);
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.add = async (req, res, next) => {
	try {
		const { content } = req.body;
		const { cardId } = req.params;

		const highestRankedItem = await Item.max("rank");

		const rank = highestRankedItem ? highestRankedItem + 1 : 1;

		const item = await Item.create({
			content,
			rank,
			cardId,
		});

		res.status(200).json(item);
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { cardId, rank, content } = req.body;

		if (cardId) {
			const items = await Item.findAll({
				where: {
					id: { [Op.not]: id },
					cardId,
					rank: { [Sequelize.Op.gte]: rank },
				},
			});

			items.forEach(async (item) => {
				await Item.update({ rank: item.rank + 1 }, { where: { id: item.id } });
			});
		}

		await Item.update(
			{ content, rank: rank ? rank : undefined, cardId },
			{ where: { id } }
		);

		const item = await Item.findByPk(id);
		res.status(200).json(item);
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.delete = async (req, res, next) => {
	try {
		const { id } = req.params;

		await Item.destroy({ where: { id } });

		res.status(200).json("Delete item successfully");
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};
