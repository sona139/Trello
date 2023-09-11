import { useCallback, useEffect, useRef, useState } from "react";
import api from "./api";
import Card from "./components/Card";
import CardCreate from "./components/CardCreate";

export const ShadowElement = ({ minHeight, onDragLeave, width }) => {
	return (
		<div
			style={{
				width,
			}}
			className="dragging-shadow"
			onDragLeave={onDragLeave}
		>
			<div
				style={{
					minHeight,
					borderRadius: "8px",
					margin: "4px 0",
					backgroundColor: "#091e420f",
				}}
			></div>
		</div>
	);
};

function App() {
	const [listCard, setListCard] = useState([]);
	const drag = useRef({ minHeight: 20 });

	// Get list card
	const getListCard = () => {
		api.Card.getAll()
			.then((res) => {
				setListCard(res);
			})
			.catch((e) => console.log(e));
	};

	useEffect(() => {
		getListCard();
	}, []);

	// Add card
	const addListCard = (data) => {
		api.Card.post(data)
			.then(() => getListCard())
			.catch((e) => console.log(e));
	};

	// Update card
	const updateCard = (cardId, data) => {
		api.Card.update(cardId, data)
			.then(() => {
				getListCard();
			})
			.catch((e) => console.log(e));
	};

	const deleteCard = (cardId) => {
		api.Card.delete(cardId)
			.then(() => getListCard())
			.catch((e) => console.log(e));
	};

	// Add item
	const addItem = (cardId, data, fetchCard) => {
		console.log("add");
		api.Item.post(cardId, data)
			.then(() => fetchCard())
			.catch((e) => console.log(e));
	};

	// Update item
	const updateItem = (itemId, data) => {
		api.Item.update(itemId, data)
			.then(() => {
				drag.current.fetchPrevCard();
				drag.current.fetchNextCard();
			})
			.catch((e) => console.log(e));
	};

	// Delete item
	const deleteItem = (itemId) => {
		api.Item.delete(itemId).then((e) => console.log(e));
	};

	const _addListCard = useCallback((data) => addListCard(data), []);

	const _updateCard = useCallback((data, cardId) => {
		updateCard(data, cardId);
	}, []);

	const _deleteCard = useCallback((cardId) => deleteCard(cardId), []);
	const _addItem = useCallback((cardId, data, fetchCard) => {
		addItem(cardId, data, fetchCard);
	}, []);
	const _updateItem = useCallback((itemId, data) => {
		updateItem(itemId, data);
	}, []);
	const _deleteItem = useCallback((itemId) => deleteItem(itemId), []);

	const onDragStart = useCallback((e, setIsDragStart, typeDrag) => {
		e.stopPropagation();

		drag.current.typeDrag = typeDrag;

		setTimeout(() => {
			setIsDragStart(true);
		}, []);

		// remove shadow of draggable
		e.dataTransfer.setDragImage(
			e.target,
			window.outerWidth,
			window.outerHeight
		);

		// clone node dragging
		const draggingElement = e.target.cloneNode(true);
		draggingElement.classList.add("dragging");

		const rect = e.target.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;

		draggingElement.style.left = rect.left + "px";
		draggingElement.style.top = rect.top + "px";

		document.querySelector(".app").appendChild(draggingElement);

		// craete placeholder

		const shadow = document.createElement("div");
		shadow.style.width = e.target.offsetWidth + "px";
		shadow.classList.add("dragging-shadow");

		// debugger;

		const child = document.createElement("div");
		child.style.pointerEvents = "none";
		child.style.minHeight = e.target.offsetHeight - 8 + "px";
		child.style.borderRadius = 8 + "px";
		child.style.margin = "4px 0";
		child.style.backgroundColor = "#091e420f";
		shadow.appendChild(child);

		drag.current = {
			...drag.current,
			offsetX,
			offsetY,
			element: draggingElement,
			shadow,
		};
	}, []);

	const onDragOver = useCallback((e, item, fetchCard) => {
		e.preventDefault();
		e.stopPropagation();

		const rect = e.target.getBoundingClientRect();
		rect.center = (rect.top + rect.bottom) / 2;

		let below = document.elementFromPoint(e.clientX, e.clientY);
		if (below.matches(".card-item")) below = below.parentElement;

		const shadow = drag.current.shadow;

		if (below.matches(".card-item-wrapper")) {
			if (e.clientY < rect.center) {
				if (!below?.previousElementSibling?.matches(".dragging-shadow")) {
					drag.current = {
						...drag.current,
						cardId: item.cardId,
						rank: +below.getAttribute("rank"),
						fetchNextCard: fetchCard,
					};

					below.insertAdjacentElement("beforebegin", shadow);
				}
			} else {
				if (!below?.nextElementSibling?.matches(".dragging-shadow")) {
					drag.current = {
						...drag.current,
						cardId: item.cardId,
						rank: +below.getAttribute("rank") + 1,
						fetchNextCard: fetchCard,
					};
					below.insertAdjacentElement("afterend", shadow);
				}
			}
		}
	}, []);

	const onDragCardOver = useCallback((e, card) => {
		e.preventDefault();
		e.stopPropagation();

		const rect = e.target.getBoundingClientRect();
		rect.center = (rect.left + rect.right) / 2;

		let below = document.elementFromPoint(e.clientX, e.clientY);

		// if (below.matches(".app"))
		while (!below?.matches(".card")) {
			below = below.parentElement;
		}

		const shadow = drag.current.shadow;

		if (below.matches(".card")) {
			if (e.clientX < rect.center) {
				if (!below?.previousElementSibling?.matches(".dragging-shadow")) {
					drag.current = {
						...drag.current,
						rank: +below.getAttribute("rank"),
					};

					below.insertAdjacentElement("beforebegin", shadow);
				}
			} else {
				if (!below?.nextElementSibling?.matches(".dragging-shadow")) {
					drag.current = {
						...drag.current,
						rank: +below.getAttribute("rank") + 1,
					};
					below.insertAdjacentElement("afterend", shadow);
				}
			}
		}
	}, []);

	const onDrag = useCallback((e) => {
		e.preventDefault();

		const x = e.clientX - drag.current.offsetX;
		const y = e.clientY - drag.current.offsetY;
		drag.current.element.style.left = x + "px";
		drag.current.element.style.top = y + "px";
	}, []);

	return (
		<div className="app">
			{listCard.map((card) => {
				return (
					<Card
						key={card.id}
						list={card}
						updateCard={_updateCard}
						deleteCard={_deleteCard}
						addItem={_addItem}
						updateItem={_updateItem}
						deleteItem={_deleteItem}
						onDragStart={onDragStart}
						onDrag={onDrag}
						drag={drag}
						onDragOver={onDragOver}
						onDragCardOver={onDragCardOver}
					/>
				);
			})}
			<CardCreate addListCard={_addListCard} />
		</div>
	);
}

export default App;
