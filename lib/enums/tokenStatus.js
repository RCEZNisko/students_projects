"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenStaus;
(function (TokenStaus) {
    TokenStaus[TokenStaus["VALID"] = 0] = "VALID";
    TokenStaus[TokenStaus["INVALID"] = 1] = "INVALID";
    TokenStaus[TokenStaus["EXPIRED"] = 2] = "EXPIRED";
})(TokenStaus || (TokenStaus = {}));
exports.default = TokenStaus;
