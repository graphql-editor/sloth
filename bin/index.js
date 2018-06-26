#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const chalk_1 = require("chalk");
const node_fetch_1 = require("node-fetch");
const fs = require("fs");
const os = require("os");
const HOST = link => `http://localhost:3000/${link}`;
const loc = `${os.homedir()}/slothking.json`;
const requireCredentials = () => new Promise((resolve, reject) => fs.readFile(loc, (e, data) => {
    if (e) {
        console.error(chalk_1.default.red("No credentials file. Please login using: sloth login. If you logged in with github, download credentials file from slothking web app and put it inside home folder as .slothking.json"));
        return reject("Forbidden");
    }
    return resolve(JSON.parse(data.toString()));
}));
const argv = yargs
    .command("logout", "Logout from your slothking account", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    console.log(chalk_1.default.redBright("Logging out..."));
    try {
        fs.unlink(loc, e => {
            if (e) {
                console.log(chalk_1.default.red("Already logged out"));
                return;
            }
            console.log(chalk_1.default.green("Successfully logged out"));
        });
    }
    catch (e) {
        console.log(chalk_1.default.red("Already logged out"));
    }
}))
    .command("login <username> <password>", "Login to your slothking account", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    console.log(chalk_1.default.white("Logging in..."));
    try {
        let parsed = yield (yield node_fetch_1.default(HOST(`user/login?username=${argv.username}&password=${argv.password}`))).json();
        if (parsed.token) {
            console.log(chalk_1.default.green(`Logged in, credentials stored in: ${loc}`));
            fs.writeFile(loc, JSON.stringify(parsed), e => { });
        }
        else {
            console.log(chalk_1.default.red("Wrong username or password"));
        }
    }
    catch (e) {
        console.log(chalk_1.default.red("Wrong username or password"));
    }
}))
    .command("nodets <project> <path>", "Reads slothking project to a typescript file specified in path", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    try {
        const credentials = yield requireCredentials();
        console.log(chalk_1.default.green("Reading slothking project and writing to folder"));
        let parsed = yield (yield node_fetch_1.default(HOST(`sloth/generateBackendTS?name=${argv.project}&token=${credentials.token}`))).json();
        let location = argv.path || "./slothking_generated.ts";
        fs.writeFile(location, parsed.code, e => {
            if (e) {
                console.error(e);
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}))
    .help().argv;
argv;
//# sourceMappingURL=index.js.map