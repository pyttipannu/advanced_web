import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useDraggable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

interface ColumnProps {
  title: string;
  id: string;
  cards: { title: string; description: string; _id: string }[];
  onTitleChange: (id: string, newTitle: string) => void;
  onMoveCard: (cardId: string, fromColumnId: string, toColumnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ title, id, onTitleChange, cards: initialCards, onMoveCard }) => {
  const {t} = useTranslation();
  const [cards, setCards] = useState(initialCards || []);
  const [newColumnTitle, setNewColumnTitle] = useState<string>(title);
  const [newCardTitle, setNewCardTitle] = useState<string>(""); 
  const [newDescription, setNewDescription] = useState<string>("");

  useEffect(() => {
    setCards(initialCards|| []);
  }, [initialCards]);

  //Adding new card to the column
  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim() || !newDescription.trim()) return;

    const newCard = {
      title: newCardTitle,
      description: newDescription,
      columnId: id,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/column/addCard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) throw new Error("Error adding card");

      const cardData = await response.json();


      setCards((prevCards) => [...prevCards, cardData]);

      
      setNewCardTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleTitleChange = () => {
    if (newColumnTitle !== title) {
      onTitleChange(id, newColumnTitle);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/column/deleteCard/${cardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
      } else {
        console.error("Error deleting card");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

//Moves card to the next one. It finds the card in the current column by its cardId

  const handleMoveCard = (cardId: string) => {
    const currentColumnIndex = cards.findIndex((card) => card._id === cardId);
    if (currentColumnIndex === -1) return;

    const nextColumnIndex = (currentColumnIndex + 1) % cards.length;
    const targetColumnId = cards[nextColumnIndex]._id; 

    onMoveCard(cardId, id, targetColumnId);
  };
  

  return (
    <div className="column">
      <h3 className="column-title">
        <input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          onBlur={handleTitleChange}
        />
      </h3>

      <form onSubmit={addCard}>
        <input
          type="text"
          placeholder={t("Card Title")}
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
        />
        <textarea
          placeholder={t("Card Description")}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button type="submit" className="btn pink">
          {t("Add Card")}
        </button>
      </form>

      <div className="card-container">
        {cards.length === 0 ? (
          <p>{t("No cards")}</p>
        ) : (
          cards.map((card) => (
            <Card
              key={card._id}
              id={card._id}
              title={card.title}
              description={card.description}
              onDelete={() => handleDeleteCard(card._id)}
              onMove={handleMoveCard}
            />
          ))
        )}
      </div>
    </div>
  );
};


export default Column;
