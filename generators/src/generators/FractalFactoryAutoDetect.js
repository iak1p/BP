import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCLUDED_FILES = new Set(["FractalFactoryAutoDetect.js"]);

async function loadGeneratorModules() {
  const files = fs
    .readdirSync(__dirname, { recursive: true })
    .filter((file) => file.endsWith(".js"))
    .filter((file) => !EXCLUDED_FILES.has(file));

  const modules = [];

  for (const file of files) {
    try {
      const fullPath = path.join(__dirname, file);

      const imported = await import(pathToFileURL(fullPath).href);
      const mod = imported.default;

      if (!mod || !mod.id || !mod.name || !mod.Generator) {
        console.warn(`Invalid generator module: ${file}`);
        continue;
      }

      modules.push(mod);
    } catch (err) {
      console.error(`Failed to load generator ${file}: ${err.message}`);
    }
  }

  return modules;
}

export async function getAvailableGenerators() {
  const modules = await loadGeneratorModules();

  return modules.map(({ Generator, ...meta }) => meta);
}

export async function createFractal(type, options = {}) {
  const modules = await loadGeneratorModules();
  const generatorModule = modules.find((m) => m.id === type);

  if (!generatorModule) {
    throw new Error(`Unknown fractal type: ${type}`);
  }

  const defaults = generatorModule.defaults || {};

  const config = {
    ...defaults,
    ...options,
    center: {
      ...(defaults.center || {}),
      ...(options.center || {}),
    },
  };

  return new generatorModule.Generator(config);
}
