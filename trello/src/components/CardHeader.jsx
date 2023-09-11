import React from "react";
import TrashIcon from "./Icon/TrashIcon";

const CardHeader = ({ title, onBlur, deleteCard, cardId }) => {
	return (
		<div className="card-header">
			<input
				onBlur={(e) => onBlur(e.target.value)}
				type="text"
				className="card-title"
				defaultValue={title}
			/>
			<TrashIcon
				style={{ height: 20, width: 20, cursor: "pointer" }}
				onClick={() => {
					deleteCard(cardId);
				}}
			/>
		</div>
	);
};

export default React.memo(CardHeader);
