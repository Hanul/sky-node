"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skynode_1 = require("@hanul/skynode");
const FileTree_1 = __importDefault(require("../src/filetree/FileTree"));
const fileTree = new FileTree_1.default([{
        name: "폴더1",
        folders: [],
        files: [{
                name: "파일1",
            }],
    }], [{
        name: "하핫",
    }]);
skynode_1.BodyNode.append(fileTree);
//# sourceMappingURL=filetree-test.js.map