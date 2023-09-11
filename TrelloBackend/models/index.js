const Card = require("../models/card.model");
const Item = require("../models/item.model");

// Associate Card - Item (1-n)
Card.hasMany(Item);
Item.belongsTo(Card);

Card.sync({ alter: false, force: false })
	.then(() => console.log("Sync Card"))
	.then(() => Item.sync({ alter: false, force: false }))
	.then(() => console.log("Sync Item"))
	.catch((err) => console.log(err));
