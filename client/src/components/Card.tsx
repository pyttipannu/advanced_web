import React from "react";
import { useTranslation } from 'react-i18next';

import "../App.css"
import { useDraggable } from "@dnd-kit/core";


interface CardProps {
  title: string;
  description: string;
  id: string;
  onDelete: (cardId: string) => void;
  onMove: (cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ title, description, id, onDelete, onMove}) => {
    const {t} = useTranslation();
  
  const handleDelete = () => {
    onDelete(id); 
  };

  const handleMove=()=> {
    onMove(id);
  };
  

  return (
    <div className="card">
    <h4 className="card-title">{title}</h4>
    <p className="card-description">{description}</p>
    <button className="delete-btn" onClick={handleDelete}>{t("Delete Card")}</button>
    <button className="move-btn" onClick={handleMove}>↪</button> {}
  </div>
);
};


export default Card;

