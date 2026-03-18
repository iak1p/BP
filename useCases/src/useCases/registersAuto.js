import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCLUDED_FILES = new Set(["usecases.base.js", "registersAuto.js"]);

async function loadUseCaseModules() {
  const files = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".js"))
    .filter((file) => !EXCLUDED_FILES.has(file));

  const modules = [];

  for (const file of files) {
    try {
      const fullPath = path.join(__dirname, file);

      const imported = await import(pathToFileURL(fullPath).href);
      const mod = imported.default;

      if (!mod || !mod.id || !mod.name || !mod.UseCase) {
        console.warn(`Invalid use case module: ${file}`);
        continue;
      }

      modules.push(mod);
    } catch (err) {
      console.error(`Failed to load use case ${file}: ${err.message}`);
    }
  }

  return modules;
}

export async function getAvailableUseCases() {
  const modules = await loadUseCaseModules();

  return modules.map(({ UseCase, ...meta }) => meta);
}

/**
 * Example input:
 * { name: "width", width: 1 }
 */
export async function createUseCase(usecase) {
  const { name = null, ...params } = usecase;

  if (!usecase || !usecase.name) {
    throw new Error("Invalid use case definition");
  }

  const modules = await loadUseCaseModules();
  const useCaseModule = modules.find((m) => m.id === name);

  if (!useCaseModule) {
    throw new Error(`Unknown use case: ${name}`);
  }

  return new useCaseModule.UseCase(params);
}
