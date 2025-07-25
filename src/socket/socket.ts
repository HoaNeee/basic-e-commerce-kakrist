import { io } from "socket.io-client";
import { BASE_URL } from "../utils/requets";

const URL = BASE_URL || "https://api.kakrist.site";

export const socket = io(URL);
