import React from "react";
import moment from "moment";

const FormattedDate: React.FC<{ date: number }> = ({ date }) => {
  return <>{moment(date).format("DD/MM/YY HH:mm:ss")}</>;
};

export default FormattedDate;
