import React, {
	useState,
	useRef,
	useEffect,
	forwardRef,
	useCallback,
} from "react";
import _isEqual from "lodash/isEqual";
import EditIcon from "./Icon/EditIcon";

const Overlay = ({ children }) => (
	<div
		style={{
			position: "absolute",
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			backgroundColor: "#0009",
			zIndex: 100,
		}}
	>
		{children}
	</div>
);

const CardItemEdit = forwardRef(
	({ content, setContent, style, onHanldeCloseEditing }, textareaRef) => {
		useEffect(() => {
			textareaRef.current.style.height =
				textareaRef.current.scrollHeight + "px";
			textareaRef.current.focus();
			const textLength = textareaRef.current.value.length;
			textareaRef.current.setSelectionRange(textLength, textLength);
		}, []);

		return (
			<textarea
				ref={textareaRef}
				style={style}
				value={content}
				onBlur={onHanldeCloseEditing}
				onInput={(e) => {
					e.target.style.height = e.target.scrollHeight + "px";
					setContent(e.target.value);
				}}
			></textarea>
		);
	}
);

const MenuEditItem = React.memo(({ menuTitle, onMouseDown }) => {
	return (
		<div className="card-edit-menu" onMouseDown={onMouseDown}>
			{menuTitle}
		</div>
	);
});

const CardItem = ({
	item,
	updateItem,
	deleteItem,
	drag,
	setCard,
	onDragStart,
	onDrag,
	onDragOver,
	fetchCard,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isDragStart, setIsDragStart] = useState(false);
	const [content, setContent] = useState(item?.content);
	const cardItemRef = useRef();
	const textareaRef = useRef();

	const hanldeClickEdit = () => {
		setIsEditing(true);
	};

	const handleCloseEditing = () => {
		setIsEditing(false);
	};

	const hanldeOnMouseDown = useCallback(async (e) => {
		e.preventDefault();
		setCard((prev) => {
			return {
				...prev,
				items: prev.items.filter((it) => it.id !== item.id),
			};
		});

		await deleteItem(item.id);
		handleCloseEditing();
	}, []);

	console.log("re-render");

	return (
		<>
			<div
				style={{
					position: "relative",
					padding: "4px 0px",
					display: isDragStart ? "none" : "unset",
				}}
				className="card-item-wrapper"
				ref={cardItemRef}
				rank={item.rank}
				draggable
				onDragStart={(e) => {
					onDragStart(e, setIsDragStart, "item");
					drag.current.fetchPrevCard = fetchCard;
				}}
				onDrag={(e) => onDrag(e)}
				onDragOver={(e) => {
					if (drag.current.typeDrag === "card") return;
					onDragOver(e, item, fetchCard);
				}}
				onDragEnd={async () => {
					setIsDragStart(false);
					document.querySelector(".dragging").remove();
					document.querySelector(".dragging-shadow")?.remove();
					drag.current.fetchPrevCard = fetchCard;

					await updateItem(item.id, {
						cardId: drag.current.cardId,
						rank: drag.current.rank,
					});
				}}
			>
				<div className="card-item">
					{content}
					<EditIcon onClick={hanldeClickEdit} />
				</div>
			</div>

			{isEditing && (
				<Overlay>
					<div
						style={{
							position: "absolute",
							left: cardItemRef.current.offsetLeft,
							top: cardItemRef.current.offsetTop,
							display: "flex",
							gap: "8px",
						}}
					>
						<div>
							<CardItemEdit
								content={content}
								setContent={setContent}
								ref={textareaRef}
								onHanldeCloseEditing={handleCloseEditing}
								style={{
									width: cardItemRef.current.offsetWidth,
								}}
							/>
							<button
								className="btn-primary"
								style={{ padding: "6px 24px", display: "block" }}
								onMouseDown={async (e) => {
									e.preventDefault();

									await updateItem(item.id, {
										content: textareaRef.current.value,
									});
									handleCloseEditing();
								}}
							>
								Lưu
							</button>
						</div>
						<div>
							<MenuEditItem menuTitle="Mở thẻ" />
							<MenuEditItem menuTitle="Chỉnh sửa nhãn" />
							<MenuEditItem menuTitle="Thay đổi thành viên" />
							<MenuEditItem menuTitle="Di chuyển" />
							<MenuEditItem menuTitle="Sao chép" />
							<MenuEditItem menuTitle="Chỉnh sửa ngày" />
							<MenuEditItem
								menuTitle="Lưu trữ"
								onMouseDown={hanldeOnMouseDown}
							/>
						</div>
					</div>
				</Overlay>
			)}
		</>
	);
};

export default React.memo(CardItem, _isEqual);
