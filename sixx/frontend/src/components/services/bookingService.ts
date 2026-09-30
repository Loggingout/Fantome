import api from "../../utils/api";

export const submitBooking = (data: any) => {
  return api.post("/bookings", data);
};
