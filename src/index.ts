#!/usr/bin/env node
import * as yargs from "yargs";
import chalk from "chalk";
import fetch from "node-fetch";
import * as fs from "fs";
import * as os from "os";
const HOST = link => `http://localhost:3000/${link}`;
const loc = `${os.homedir()}/.slothking.json`;

export type Credentials = {
  username: string;
  token: string;
};

const requireCredentials = (): Promise<Credentials> =>
  new Promise((resolve, reject) =>
    fs.readFile(loc, (e, data) => {
      if (e) {
        console.error(
          chalk.red(
            "No credentials file. Please login using: sloth login. If you logged in with github, download credentials file from slothking web app and put it inside home folder as .slothking.json"
          )
        );
        return reject("Forbidden");
      }
      return resolve(JSON.parse(data.toString()) as Credentials);
    })
  );

const argv = yargs
  .command("logout", "Logout from your slothking account", {}, async argv => {
    console.log(chalk.redBright("Logging out..."));
    try {
      fs.unlink(loc, e => {
        if (e) {
          console.log(chalk.red("Already logged out"));
          return;
        }
        console.log(chalk.green("Successfully logged out"));
      });
    } catch (e) {
      console.log(chalk.red("Already logged out"));
    }
  })
  .command(
    "login <username> <password>",
    "Login to your slothking account",
    {},
    async argv => {
      console.log(chalk.white("Logging in..."));
      try {
        let parsed = await (await fetch(
          HOST(`user/login?username=${argv.username}&password=${argv.password}`)
        )).json();
        if (parsed.token) {
          console.log(chalk.green(`Logged in, credentials stored in: ${loc}`));
          fs.writeFile(loc, JSON.stringify(parsed), e => {});
        } else {
          console.log(chalk.red("Wrong username or password"));
        }
      } catch (e) {
        console.log(chalk.red("Wrong username or password"));
      }
    }
  )
  .command(
    "nodets <project> <path>",
    "Reads slothking project to a typescript file specified in path",
    {},
    async argv => {
      try {
        const credentials: Credentials = await requireCredentials();
        console.log(
          chalk.green("Reading slothking project and writing to folder")
        );

        let parsed = await (await fetch(
          HOST(
            `sloth/generateBackendTS?name=${argv.project}&token=${
              credentials.token
            }`
          )
        )).json();
        let location = argv.path || "./slothking_generated.ts";
        fs.writeFile(location, parsed.code, e => {
          if (e) {
            console.error(e);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  )
  .help().argv;
argv;
