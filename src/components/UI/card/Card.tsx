import React from "react";
import classes from "./Card.module.scss";
interface ICard {
  children: React.ReactNode;
}
const Card = (props: ICard) => {
  return <div className="dashboard-card padding-fix">{props.children}</div>;
};

export default Card;
