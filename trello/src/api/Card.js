import request from "./request";

const routes = {
	ADD: "/card",
	ALL: "/card",
	BY_ID: (id) => `card/${id}`,
};

const Card = {
	post: (formData) => request.post(routes.ADD, formData),

	get: (id) => request.get(routes.BY_ID(id)),

	getAll: () => request.get(routes.ALL),

	getById: (id) => request.get(routes.BY_ID(id)),

	update: (id, formData) => request.put(routes.BY_ID(id), formData),

	delete: (id) => request.delete(routes.BY_ID(id)),
};

export default Card;
