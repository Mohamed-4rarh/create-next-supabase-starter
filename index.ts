#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import degit from "degit";
import prompts from "prompts";

// CLI Banner
console.log(chalk.blue.bold("\n🚀 Create Next.js + Supabase Project\n"));

(async () => {
  let projectName = process.argv[2];

  // If no project name, ask once. If still empty, use default name.
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

  // Clone the starter repo
  const repo = "https://github.com/Mohamed-4rarh/next-supabase-starter.git";
  const emitter = degit(repo, { cache: false, force: true });

  try {
    await emitter.clone(projectName);
    console.log(chalk.green("✅ Starter project cloned successfully!"));

    // Navigate into project
    process.chdir(projectName);

    // Install dependencies
    console.log(chalk.blue("\n📦 Installing dependencies...\n"));
    execSync("pnpm install", { stdio: "inherit" });

    // Ask if the user wants to initialize Git
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
      console.log(chalk.blue("\nYour Git Intialized, Just run 'git push'\n"));
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

    // 🎉 Custom About Me Message
    console.log(
      chalk.magenta.bold("\n----------------------------------------")
    );
    console.log(chalk.cyan.bold("🎉 Created by Mohamed Ararh 🚀"));
    console.log(
      chalk.magenta("💻 GitHub: ") +
        chalk.cyan("https://github.com/Mohamed-4rarh")
    );
    console.log(
      chalk.magenta.bold("----------------------------------------\n")
    );
  } catch (error) {
    console.error(chalk.red("❌ Error setting up project:", error));
  }
})();
