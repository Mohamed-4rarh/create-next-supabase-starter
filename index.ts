#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import degit from "degit";
import { readFileSync, existsSync } from "fs";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

// Fix __dirname issue for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// **Locate package.json dynamically**
let currentVersion = "unknown"; // Default in case package.json is missing
const packageJsonPath = path.resolve(__dirname, "../package.json");
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  currentVersion = packageJson.version;
}

// **Function to check and update to latest version**
const checkAndUpdateVersion = async () => {
  console.log(chalk.green("Checking For Updates..."));
  try {
    const response = await fetch(
      "https://registry.npmjs.org/create-next-supabase-starter/latest"
    );
    const data = (await response.json()) as { version?: string };

    if (!data.version) {
      console.warn(
        chalk.red("⚠️ Could not fetch the latest version. Continuing...")
      );
      return;
    }

    if (currentVersion !== data.version) {
      console.log(
        chalk.yellow(`⚠️ A newer version (${data.version}) is available!`)
      );
      console.log(chalk.green(`🔄 Updating automatically...`));

      // **Automatically install the latest version and restart**
      try {
        execSync(
          `pnpm dlx create-next-supabase-starter@latest ${process.argv
            .slice(2)
            .join(" ")}`,
          {
            stdio: "inherit",
          }
        );
        process.exit(0);
      } catch (updateError) {
        console.error(
          chalk.red(
            "❌ Failed to update automatically. Please update manually."
          )
        );
        console.log(
          chalk.cyan(
            `Run: pnpm dlx create-next-supabase-starter@latest my-project`
          )
        );
        process.exit(1);
      }
    } else {
      console.log(chalk.green("You're updated 🎉"));
    }
  } catch (error) {
    console.warn(
      chalk.red("⚠️ Failed to check for latest version. Continuing...")
    );
  }
};

// **Ensure everything runs inside an async function**
const runCLI = async () => {
  await checkAndUpdateVersion();

  // **CLI Banner**
  console.log(chalk.blue.bold("\n🚀 Create Next.js + Supabase Project\n"));

  let projectName = process.argv[2];

  // **If no project name, ask once. If still empty, use default name.**
  if (!projectName) {
    const response = await prompts({
      type: "text",
      name: "name",
      message: "Enter your project name (or press enter to use default):",
      initial: "next-supabase-starter",
    });

    projectName = response.name.trim() || "next-supabase-starter";
  }

  console.log(chalk.green(`\n📦 Setting up ${projectName}...\n`));

  // **Clone the starter repo**
  const repo = "https://github.com/Mohamed-4rarh/next-supabase-starter.git";
  const emitter = degit(repo, { cache: false, force: true });

  try {
    await emitter.clone(projectName);
    console.log(chalk.green("✅ Starter project cloned successfully!"));

    // **Navigate into project**
    process.chdir(projectName);

    // **Install dependencies**
    console.log(chalk.blue("\n📦 Installing dependencies...\n"));
    execSync("pnpm install", { stdio: "inherit" });

    // **Ask if the user wants to initialize Git**
    const gitResponse = await prompts({
      type: "confirm",
      name: "initializeGit",
      message: "Do you want to initialize Git?",
      initial: true,
    });

    if (gitResponse.initializeGit) {
      console.log(chalk.blue("\n🔗 Initializing Git...\n"));
      execSync("git init && git add . && git commit -m 'Initial commit'", {
        stdio: "inherit",
      });
    } else {
      console.log(chalk.yellow("\n⚠️ Skipped Git initialization."));
    }

    console.log(
      chalk.green(
        "\n🚀 Setup complete! Run the following to start your project:\n"
      )
    );
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan("  pnpm dev\n"));

    // 🎉 **Custom About Me Message**
    console.log(
      chalk.magenta.bold("\n----------------------------------------")
    );
    console.log(chalk.green.bold("🎉 Created by Mohamed-4rarh 🚀"));
    console.log(
      chalk.green("💻 GitHub: ") +
        chalk.cyan("https://github.com/Mohamed-4rarh")
    );
    console.log(chalk.green.bold("----------------------------------------\n"));
  } catch (error) {
    console.error(chalk.red("❌ Error setting up project:", error));
  }
};

// **Run the CLI inside an async function**
runCLI();
