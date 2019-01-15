import * as fs from 'fs';
import * as MongoClientRequest from 'mongodb';
import * as _ from 'lodash';
import { join } from 'path';
const MongoClient = MongoClientRequest.MongoClient;
// tslint:disable:max-line-length
const url = 'mongodb://admin:super-admin-1234@cmu-projects-cluster-shard-00-00-ylevo.mongodb.net:27017,cmu-projects-cluster-shard-00-01-ylevo.mongodb.net:27017,cmu-projects-cluster-shard-00-02-ylevo.mongodb.net:27017/test?ssl=true&replicaSet=CMU-PROJECTS-CLUSTER-shard-0&authSource=admin&retryWrites=true';
const dbName = 'pg-analytics';

function cleanup(client) {
    client.close();
    console.log('CLIENT CLOSED');
}

export async function getPrivacyRatingDistribution(client, taxonomy, callback) {
    const db = client.db(dbName);
    const appsCollection = db.collection('apps');
    const ratingDistribution = {
        'A': await appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: 'A' }).count(),
        'B': await appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: 'B' }).count(),
        'C': await appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: 'C' }).count(),
        'D': await appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: 'D' }).count(),
        'UNKNOWN': await appsCollection.find({ taxonomies: { $in: [taxonomy] }, privacyRating: '' }).count()
    };
    cleanup(client);
    callback(ratingDistribution);
}

export async function searchApp(client, packageId, callback) {
    console.log('srearch app called');
    const db = client.db(dbName);
    const appsCollection = db.collection('apps');
    const query = {
        package: packageId
    };
    const data: any = await appsCollection.find(query).toArray();
    cleanup(client);
    callback(data);
}

export function connectToDb (callback) {
    console.log('CLIENT CONNECTION CREATED');
    const client = new MongoClient(url);
    client.connect(function (err) {
        callback(client);
    });
}
