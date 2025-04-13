import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "../App.css";

interface AddColumnProps {
  onAdd: (column: { title: string }) => void;
}

const AddColumn: React.FC<AddColumnProps> = ({ onAdd }) => {
    const {t} = useTranslation();
  
  // console.log("AddColumn component rendered");
  const [title, setTitle] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({ title });
    setTitle("");
  };

  return (
    <div className="input-field">
      <form onSubmit={handleSubmit}>
        <label>{t("Column Title")}</label>
        <input
          type="text"
          placeholder={t("Enter column name...")}
          onChange={(e) => setTitle(e.target.value)}
          value={title}/>
        <button type="submit" className="btn pink">{t("Add Column")}</button>
      </form>
    </div>
  );
};

export default AddColumn;
