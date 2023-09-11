import React, { useEffect, useRef, useState } from "react";
import TrashIcon from "./Icon/TrashIcon";

const CardCreate = ({ addListCard }) => {
	const [isCreating, setIsCreating] = useState(false);
	const inputRef = useRef();

	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, [isCreating]);

	const handleCloseCreating = () => {
		setIsCreating(false);
	};

	return !isCreating ? (
		<div className="card-create" onClick={() => setIsCreating(true)}>
			<span className="add-icon">+</span>
			Thêm danh sách khác
		</div>
	) : (
		<form
			className="card-creating"
			onSubmit={async (e) => {
				e.preventDefault();

				await addListCard({ title: inputRef.current.value.trim() });
				inputRef.current.value = "";
				inputRef.current.focus();
			}}
		>
			<input
				ref={inputRef}
				placeholder="Nhập tiêu đề danh sách..."
				type="text"
				className="card-title"
				onBlur={handleCloseCreating}
			/>
			<button
				className="btn-primary"
				type="submit"
				onMouseDown={async (e) => {
					e.preventDefault();

					await addListCard({ title: inputRef.current.value.trim() });
					inputRef.current.value = "";
					inputRef.current.focus();
				}}
			>
				Thêm danh sách
			</button>
			<button
				className="close-btn"
				onClick={() => {
					handleCloseCreating();
				}}
			>
				<TrashIcon />
			</button>
		</form>
	);
};

export default CardCreate;
