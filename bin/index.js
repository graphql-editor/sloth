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
console.log(`Current host = ${H}\n`);
const requireCredentials = () => new Promise((resolve, reject) => fs.readFile(loc, (e, data) => {
    if (e) {
        console.error(chalk_1.default.red("No credentials file. Please login using: sloth login. If you logged in with github, download credentials file from slothking web app and put it inside home folder as .slothking.json"));
        return reject("Forbidden");
    }
    return resolve(JSON.parse(data.toString()));
}));
const codeSaver = (generator, project, path) => __awaiter(this, void 0, void 0, function* () {
    try {
        const credentials = yield requireCredentials();
        console.log(chalk_1.default.green(`Reading slothking project and writing to folder with generator: ${generator}`));
        let parsed = yield (yield node_fetch_1.default(HOST(`sloth/${generator}?name=${project}&token=${credentials.token}`))).json();
        let location = path || "./slothking_generated.ts";
        fs.writeFile(location, parsed.code, e => {
            if (e) {
                console.error(e);
            }
        });
    }
    catch (error) {
        console.error(error);
    }
});
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
    .command("register <username> <password> <repeat_password>", "Register new slothking account", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    console.log(chalk_1.default.white("Registering..."));
    if (argv.password !== argv.repeat_password) {
        return chalk_1.default.red("Password mismatch");
    }
    try {
        let parsed = yield (yield node_fetch_1.default(HOST(`user/register?username=${argv.username}&password=${argv.password}`))).json();
        if (parsed.token) {
            console.log(chalk_1.default.green(`Registered & Logged in, credentials stored in: ${loc}`));
            fs.writeFile(loc, JSON.stringify(parsed), e => { });
        }
        else {
            console.log(chalk_1.default.red("Username already exists"));
        }
    }
    catch (e) {
        console.log(chalk_1.default.red("Username already exists"));
    }
}))
    .command("sync <api> <project> <path>", "Reads slothking project to a typescript backend file specified in path", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    const socket = socketClient(WS);
    socket.on("connect", function () {
        console.log("Connected to websocket");
    });
    socket.on(argv.project, function (data) {
        console.log(`Project ${argv.project} updated`);
        codeSaver(APIS[argv.api], argv.project, argv.path);
        console.log(`Waiting for updates`);
    });
    socket.on("disconnect", function () {
        console.log("Disconnected to websocket");
    });
}))
    .exitProcess(false)
    .command("nodets <project> <path>", "Reads slothking project to a typescript backend file specified in path", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    yield codeSaver("generateBackendTS", argv.project, argv.path);
}))
    .command("fetch-api <project> <path>", "Reads slothking project to a typescript fetch api specified in path", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    yield codeSaver("generateFetchApi", argv.project, argv.path);
}))
    .command("corona-sdk <project> <path>", "Reads slothking project to a corona SDK api specified in path", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    yield codeSaver("generateCoronaSDK", argv.project, argv.path);
}))
    .command("schema <project> <path>", "Reads slothking project to a form kind schema api specified in path", {}, (argv) => __awaiter(this, void 0, void 0, function* () {
    yield codeSaver("generateSchema", argv.project, argv.path);
}))
    .help().argv;
argv;
//# sourceMappingURL=index.js.map