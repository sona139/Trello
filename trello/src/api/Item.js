import request from "./request";

const routes = {
	BY_CARD_ID: (cardId) => `item/card/${cardId}`,
	BY_ID: (id) => `item/${id}`,
};

const Item = {
	post: (cardId, formData) => request.post(routes.BY_CARD_ID(cardId), formData),

	getAll: (cardId) => request.get(routes.BY_CARD_ID(cardId)),

	getById: (id) => request.get(routes.BY_ID(id)),

	update: (id, formData) => request.put(routes.BY_ID(id), formData),

	delete: (id) => request.delete(routes.BY_ID(id)),
};

export default Item;
