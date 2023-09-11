import React, { useCallback, useEffect, useRef, useState } from "react";
import _isEqual from "lodash/isEqual";
import CardHeader from "./CardHeader";
import CardItem from "./CardItem";
import TrashIcon from "./Icon/TrashIcon";
import api from "../api";

const Card = ({
	list,
	updateCard,
	deleteCard,
	addItem,
	updateItem,
	deleteItem,
	drag,
	onDragStart,
	onDrag,
	onDragOver,
	onDragCardOver,
}) => {
	const [isAdding, setIsAdding] = useState(false);
	const [isDragStart, setIsDragStart] = useState(false);
	const [card, setCard] = useState(list);
	const textareaRef = useRef();

	const fetchCard = useCallback(() => {
		api.Card.get(card.id).then((res) => {
			setCard(res);
		});
	}, []);

	useEffect(() => {
		if (isAdding && textareaRef.current) textareaRef.current.focus();
	}, [isAdding]);

	const onBlurTitleHeader = useCallback((title) => {
		updateCard(card.id, { title });
	}, []);

	const hanldeCloseAdding = () => {
		setIsAdding(false);
	};

	const handleAddItem = async () => {
		const content = textareaRef.current.value.trim();

		await addItem(card.id, { content }, fetchCard);
		textareaRef.current.value = "";
		// focusTextarea();
	};

	const handleSetCard = useCallback((value) => setCard(value), []);

	return (
		<>
			<div
				className="card"
				style={{
					display: isDragStart ? "none" : "block",
				}}
				draggable
				onDragStart={(e) => {
					onDragStart(e, setIsDragStart, "card");
				}}
				onDrag={onDrag}
				onDragOver={(e) => {
					e.stopPropagation();
					e.preventDefault();
					if (drag.current.typeDrag === "item") {
						let Card = document.elementFromPoint(e.clientX, e.clientY);
						if (Card.matches(".dragging-shadow")) return;
						while (!Card.matches(".card")) {
							Card = Card.parentElement;
						}

						if (Card.matches(".card")) {
							const cardBody = Card.querySelector(".card-body");

							const maxRank = card.items.reduce(
								(max, item) => Math.max(max, item.rank),
								1
							);

							cardBody.appendChild(drag.current.shadow);

							drag.current = {
								...drag.current,
								cardId: card.id,
								rank: maxRank,
								fetchNextCard: fetchCard,
							};
						}
						return;
					}

					onDragCardOver(e, card);
				}}
				onDragEnd={async () => {
					if (drag.current.typeDrag === "item") return;
					setIsDragStart(false);
					document.querySelector(".dragging")?.remove();

					await updateCard(card.id, { rank: drag.current.rank });

					document.querySelector(".dragging-shadow")?.remove();
				}}
			>
				<CardHeader
					title={card.title}
					onBlur={onBlurTitleHeader}
					deleteCard={deleteCard}
					cardId={card.id}
				/>
				<div className="card-body">
					{card.items.map((item) => (
						<CardItem
							key={item.id}
							item={item}
							updateItem={updateItem}
							deleteItem={deleteItem}
							drag={drag}
							setCard={handleSetCard}
							onDragStart={onDragStart}
							onDrag={onDrag}
							onDragOver={onDragOver}
							card={card}
							fetchCard={fetchCard}
						/>
					))}
					{isAdding && (
						<form
							style={{ display: "flex", flexWrap: "wrap" }}
							onSubmit={(e) => {
								e.preventDefault();
								handleAddItem();
							}}
						>
							<textarea
								style={{ width: "100%" }}
								onBlur={hanldeCloseAdding}
								ref={textareaRef}
								onKeyUp={(e) => {
									if (e.code === "Enter") {
										handleAddItem();
									}
									e.target.style.height = e.target.scrollHeight + "px";
								}}
								className="card-item"
								placeholder="Nhập tiêu đề cho thẻ này..."
							></textarea>
							<button
								className="btn-primary"
								type="submit"
								onMouseDown={(e) => {
									e.preventDefault();
									handleAddItem();
								}}
							>
								Thêm thẻ
							</button>
							<button className="close-btn" onClick={hanldeCloseAdding}>
								<TrashIcon />
							</button>
						</form>
					)}
				</div>
				{!isAdding && (
					<div className="card-footer">
						<div
							className="card-add-btn"
							onClick={() => {
								setIsAdding(true);
							}}
						>
							<div className="add-icon">+</div>
							<div>Thêm thẻ</div>
						</div>
						<div className="card-created-btn"></div>
					</div>
				)}
			</div>
		</>
	);
};

export default React.memo(Card, _isEqual);
