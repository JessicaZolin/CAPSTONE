import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import globalRouter from "./router.js";


// per importare più file variabili d'ambiente .env (assegno ad ognuna un nome diverso)
/* import dotenv from "dotenv";
dotenv.config({ path: "./.env.staging" }); */

// ----------------------------------- creo il server
const server = express();

// ----------------------------------- middleware
server.use(express.json()); // per accettare richieste json
server.use(cors()); // per accettare richieste da altri server

server.use('/api/v1', globalRouter); // collega il server alle rotte

// ----------------------------------- connessione al database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log(" ✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.log("❌ Error connecting to MongoDB", error);
    process.exit(1);
  });

// ----------------------------------- metto in ascolto il server
if (process.env.PORT) {
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
} else {
  console.log("Error: No port specified");
}
