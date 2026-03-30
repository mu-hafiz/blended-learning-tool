const formatDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate();
  const suffix = (day > 3 && day < 21) ? "th" : ["th","st","nd","rd","th","th","th","th","th","th"][day % 10];

  return `${day}${suffix} ${d.toLocaleString("en-GB", { month: "long" })} ${d.getFullYear()} (${d.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).toLowerCase()})`;
}

export default formatDate;