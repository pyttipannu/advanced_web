import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom"; 
import { DndContext, DragEndEvent, DragStartEvent, useDroppable, useDraggable, closestCenter } from '@dnd-kit/core';
import Column from "./Column";
import AddColumn from "./AddColumn";
import "../App.css";
import Card from "./Card";

interface CardProps {
  _id: string;
  title: string;
  description: string;
  onDelete: (cardId: string) => void; 
  handleTitleChange: (cardId: string, newTitle: string) => void;
}

interface ColumnType {
  _id: string;
  title: string;
  cards: string[];
  cardObjects: CardProps[];
}

const Board: React.FC = () => {
  const {t} = useTranslation();
  const { userId } = useParams<{ userId: string }>(); 
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [error, setError] = useState<string | null>(null);
  //const [cardObjects, setCards] = useState<CardType[]>([])

  useEffect(() => {
    //console.log("now fetching ")
    const fetchBoards = async () => {
  
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/column/board`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const responseData = await response.json();
          console.error("Server Error:", responseData.message || "Unknown error");
          return;
        }

        const columnsWithCards = await response.json();
        console.log(columnsWithCards)
        if (columnsWithCards.length > 0) {
          setColumns(columnsWithCards);
          //setCards(cardObjects);
        }
        else{
          console.log("no columns found :(")
        }
      } catch (error) {
        setError("Failed to load board.");
        console.error("CLIENT Error fetching board:", error);
      }

    };

    fetchBoards();
  }, [userId]);


/*Adds new column to board. Sends POST request to server and if successful
it the new column is added to columns state*/
  const addColumn = async (column: { title: string }) => {
    try {

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/column/addColumn`, {
        method: "POST",
        headers: {"Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: column.title }),
      });

      if (!response.ok) throw new Error("CLIENT Error creating column");

      const newColumn = await response.json();
      setColumns((prevColumns) => [...prevColumns, newColumn]);
    } catch (error) {
      console.error("CLIENT Error adding column", error);
    }
  };

  //First updates the columns locally then sends POST request to server to change on the backend
  const changeTitle = async (id: string, newTitle: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column._id === id ? { ...column, title: newTitle } : column
      )
    );
    try {

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/column/changeTitle`, {
        method: "POST",
        headers: {"Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ columnId: id, newTitle: newTitle  }),
      });

    } catch (error) {
      console.error("CLIENT Error changing name", error);
    }
  };

  //Sends delete request to the server to remove column, then column is removed the columns state
  const deleteColumn = async (columnId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/column/deleteColumn/${columnId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("CLIENT Error deleting column");
  
      setColumns((prevColumns) => prevColumns.filter((col) => col._id !== columnId));
    } catch (error) {
      console.error("CLIENT Error deleting column", error);
    }
  };

  //When backend processes, it updates column by first removing card from original and then adding the card to the new one
  const onMoveCard = async (cardId: string, fromColumnId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/column/moveCard`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cardId, fromColumnId }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error("Server Error:", responseData.message || "Unknown error");
        return;
      }
      
      const toColumnId :string =responseData.nextColumnId;
    
      //Setting the card to state
      setColumns((prevColumns) => {
        let movingCard: CardProps | null = null;
  
        //First, removing the card from the original column
        const updatedColumns = prevColumns.map((col) => {
          if (col._id === fromColumnId) {
            movingCard = col.cardObjects.find((cardObject) => cardObject._id === cardId) || null;
            return { ...col, cardObjects: col.cardObjects.filter((cardObject) => cardObject._id !== cardId) };
          }
          return col;
        });
        //console.log(movingCard)

        //Then after adding the card to the new column
        return updatedColumns.map((col) => {
          console.log(col._id)
          console.log(toColumnId)

          if (col._id === toColumnId && movingCard) {

            return { ...col, cardObjects: [...col.cardObjects, movingCard] };

          }
          return col;
        });
      });
    } catch (error) {
      console.error("Error moving card:", error);
    }
  };




return (
  <div>
    <h2>{t("Your Board")}</h2>
    <AddColumn onAdd={addColumn} />
    <div className="columns-container">
      {columns.length === 0 ? (
        <p>{t("No columns yet")}</p>
      ) : (
        columns.map((col) => (
          <div key={col._id} className="column-container">
            <button
              onClick={() => deleteColumn(col._id)}
              className="delete-column-btn">
              {t("Delete Column")}
            </button>
            <Column
              key={col._id}
              title={col.title}
              id={col._id}
              onTitleChange={changeTitle}
              cards={col.cardObjects}
              onMoveCard={onMoveCard}
            />
          </div>
        ))
      )}
    </div>
  </div>
);
};

export default Board;
