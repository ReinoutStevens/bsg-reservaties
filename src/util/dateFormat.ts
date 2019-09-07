import { DateTime } from "luxon";

function formatDate(date: DateTime) {
  return date.toFormat('dd/LL/yyyy HH:mm:ss');
}

export default formatDate;
