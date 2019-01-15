"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var MongoClientRequest = require("mongodb");
var MongoClient = MongoClientRequest.MongoClient;
// tslint:disable:max-line-length
var url = 'mongodb://admin:super-admin-1234@cmu-projects-cluster-shard-00-00-ylevo.mongodb.net:27017,cmu-projects-cluster-shard-00-01-ylevo.mongodb.net:27017,cmu-projects-cluster-shard-00-02-ylevo.mongodb.net:27017/test?ssl=true&replicaSet=CMU-PROJECTS-CLUSTER-shard-0&authSource=admin&retryWrites=true';
var dbName = 'pg-analytics';
function cleanup(client) {
    client.close();
    console.log('CLIENT CLOSED');
}
function getPrivacyRatingDistribution(client, taxonomy, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var db, appsCollection, ratingDistribution, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    db = client.db(dbName);
                    appsCollection = db.collection('apps');
                    _a = {};
                    _b = 'A';
                    return [4 /*yield*/, appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: 'A' }).count()];
                case 1:
                    _a[_b] = _g.sent();
                    _c = 'B';
                    return [4 /*yield*/, appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: 'B' }).count()];
                case 2:
                    _a[_c] = _g.sent();
                    _d = 'C';
                    return [4 /*yield*/, appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: 'C' }).count()];
                case 3:
                    _a[_d] = _g.sent();
                    _e = 'D';
                    return [4 /*yield*/, appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: 'D' }).count()];
                case 4:
                    _a[_e] = _g.sent();
                    _f = 'UNKNOWN';
                    return [4 /*yield*/, appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: '' }).count()];
                case 5:
                    ratingDistribution = (_a[_f] = _g.sent(),
                        _a);
                    cleanup(client);
                    callback(ratingDistribution);
                    return [2 /*return*/];
            }
        });
    });
}
exports.getPrivacyRatingDistribution = getPrivacyRatingDistribution;
function searchApp(client, packageId, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var db, appsCollection, query, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('srearch app called');
                    db = client.db(dbName);
                    appsCollection = db.collection('apps');
                    query = {
                        package: packageId
                    };
                    return [4 /*yield*/, appsCollection.find(query).toArray()];
                case 1:
                    data = _a.sent();
                    cleanup(client);
                    callback(data);
                    return [2 /*return*/];
            }
        });
    });
}
exports.searchApp = searchApp;
function connectToDb(callback) {
    console.log('CLIENT CONNECTION CREATED');
    var client = new MongoClient(url);
    client.connect(function (err) {
        callback(client);
    });
}
exports.connectToDb = connectToDb;
//# sourceMappingURL=search.js.map