import React from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const FormattedDate: React.FC<{ date: number }> = ({ date }) => {
  return <>{formatter.format(new Date(date))}</>;
};

export default FormattedDate;
