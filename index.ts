#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import degit from "degit";

// CLI Banner
console.log(chalk.blue.bold("\n🚀 Create Next.js + Supabase Project\n"));

(async () => {
  const projectName = process.argv[2];

  if (!projectName) {
    console.log(chalk.red("❌ Please provide a project name!"));
    console.log(
      chalk.yellow("Example: pnpm dlx create-next-supabase my-project")
    );
    process.exit(1);
  }

  console.log(chalk.green(`\n📦 Setting up ${projectName}...\n`));

  // Clone the starter repo
  const repo = "https://github.com/Mohamed-4rarh/next-supabase-starter.git"; // Replace with your actual repo
  const emitter = degit(repo, { cache: false, force: true });

  try {
    await emitter.clone(projectName);
    console.log(chalk.green("✅ Starter project cloned successfully!"));

    // Navigate into project
    process.chdir(projectName);

    // Install dependencies
    console.log(chalk.blue("\n📦 Installing dependencies...\n"));
    execSync("pnpm install", { stdio: "inherit" });

    // Initialize Git
    console.log(chalk.blue("\n🔗 Initializing Git...\n"));
    execSync("git init && git add . && git commit -m 'Initial commit'", {
      stdio: "inherit",
    });

    console.log(
      chalk.green(
        "\n🚀 Setup complete! Run the following to start your project:\n"
      )
    );
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan("  pnpm dev\n"));
  } catch (error) {
    console.error(chalk.red("❌ Error setting up project:", error));
  }
})();
