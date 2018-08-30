#!/usr/bin/env node
import * as yargs from "yargs";
import chalk from "chalk";
import fetch from "node-fetch";
import * as fs from "fs";
import * as os from "os";

const H = process.env.DEV
  ? "http://localhost:3000"
  : "https://slothking-backend.aexol.com";

const WS = process.env.DEV
  ? "ws://localhost:3000"
  : "wss://slothking-backend.aexol.com";

const socketClient = require("socket.io-client");

const HOST = link => `${H}/${link}`;
const loc = `${os.homedir()}/slothking.json`;

const APIS = {
  nodets: "generateBackendTS",
  "fetch-api": "generateFetchApi",
  "corona-sdk": "generateCoronaSDK",
  schema: "generateSchema"
};

export type Credentials = {
  username: string;
  token: string;
};
console.log(`Current host = ${H}\n`);
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
const codeSaver = async (generator: string, project: string, path?: string) => {
  try {
    const credentials: Credentials = await requireCredentials();
    console.log(
      chalk.green(
        `Reading slothking project and writing to folder with generator: ${generator}`
      )
    );
    let parsed = await (await fetch(
      HOST(`sloth/${generator}?name=${project}&token=${credentials.token}`)
    )).json();
    let location = path || "./slothking_generated.ts";
    fs.writeFile(location, parsed.code, e => {
      if (e) {
        console.error(e);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

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
    "register <username> <password> <repeat_password>",
    "Register new slothking account",
    {},
    async argv => {
      console.log(chalk.white("Registering..."));
      if (argv.password !== argv.repeat_password) {
        return chalk.red("Password mismatch");
      }
      try {
        let parsed = await (await fetch(
          HOST(
            `user/register?username=${argv.username}&password=${argv.password}`
          )
        )).json();
        if (parsed.token) {
          console.log(
            chalk.green(`Registered & Logged in, credentials stored in: ${loc}`)
          );
          fs.writeFile(loc, JSON.stringify(parsed), e => {});
        } else {
          console.log(chalk.red("Username already exists"));
        }
      } catch (e) {
        console.log(chalk.red("Username already exists"));
      }
    }
  )
  .command(
    "sync <api> <project> <path>",
    "Reads slothking project to a typescript backend file specified in path",
    {},
    async argv => {
      const socket = socketClient(WS);
      socket.on("connect", function() {
        console.log("Connected to websocket");
      });
      socket.on(argv.project, function(data) {
        console.log(`Project ${argv.project} updated`);
        codeSaver(APIS[argv.api], argv.project, argv.path);
        console.log(`Waiting for updates`);
      });
      socket.on("disconnect", function() {
        console.log("Disconnected to websocket");
      });
    }
  )
  .exitProcess(false)
  .command(
    "nodets <project> <path>",
    "Reads slothking project to a typescript backend file specified in path",
    {},
    async argv => {
      await codeSaver("generateBackendTS", argv.project, argv.path);
    }
  )
  .command(
    "fetch-api <project> <path>",
    "Reads slothking project to a typescript fetch api specified in path",
    {},
    async argv => {
      await codeSaver("generateFetchApi", argv.project, argv.path);
    }
  )
  .command(
    "corona-sdk <project> <path>",
    "Reads slothking project to a corona SDK api specified in path",
    {},
    async argv => {
      await codeSaver("generateCoronaSDK", argv.project, argv.path);
    }
  )
  .command(
    "schema <project> <path>",
    "Reads slothking project to a form kind schema api specified in path",
    {},
    async argv => {
      await codeSaver("generateSchema", argv.project, argv.path);
    }
  )
  .help().argv;
argv;
