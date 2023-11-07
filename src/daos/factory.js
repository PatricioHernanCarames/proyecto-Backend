import dotenv from "dotenv";
import mongoose from "mongoose";
import minimist from "minimist"; // Para analizar los argumentos de la línea de comandos

dotenv.config({ path: '../../.env' });

const MONGO_URL = process.env.DATABASE_URL;

export let Persist;

async function initializePersistence(config) {
 

  switch (config.persistence) {
    case "MONGO":
      const connection = await mongoose.connect(MONGO_URL);
      const { default: PersistenceMongo } = await import('./managers/mongo/userManagerMongo.js');
      Persist = PersistenceMongo;
      break;

    case 'MEMORY':
      const { default: PersistenceMemory } = await import("../src/daos/memory/persistence.memory.js");
      Persist = PersistenceMemory;
      break;

    default:
      throw new Error('Opción de persistencia no válida');
  }

  return Persist;
}

// Parsear los argumentos de la línea de comandos
const args = minimist(process.argv.slice(2));
const config = { persistence: args.persistence }; // Obtener la opción de persistencia de los argumentos

if (!config.persistence) {
  console.error("Debes especificar una opción de persistencia (--persistence MONGO o --persistence MEMORY)");
  process.exit(1);
}

// Inicializar la persistencia según la opción proporcionada
initializePersistence(config)
  .then((Persistence) => {
    // Utiliza la implementación de persistencia seleccionada (Persist)
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
