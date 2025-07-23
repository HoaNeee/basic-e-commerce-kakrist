import { io } from "socket.io-client";
import { BASE_URL } from "../utils/requets";

const URL = BASE_URL || "http://localhost:3001";

export const socket = io(URL);
