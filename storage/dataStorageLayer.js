'use strict';

const { CODES, TYPES, MESSAGES } = require('./statuscodes');
const Database = require('./database');
const options = require('./databaseOptions.json');
const sql = require('./sqlStatements.json');
const { toArrayInsert, toArrayUpdate } = require('./parameters');

const getAllSql = sql.getAll.join(' ');
const getSql = sql.get.join(' ');
const insertSql = sql.insert.join(' ');
const updateSql = sql.update.join(' ');
const removeSql = sql.remove.join(' ');
const PRIMARY_KEY = sql.primaryKey;

module.exports = class DataStorage {
    constructor() {
        this.catdb = new Database(options);
    }

    get CODES() {
        return CODES;
    }

    getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.catdb.doQuery(getAllSql);
                resolve(result.queryResult);
            }
            catch(error) {
                reject(MESSAGES.PROGRAM_ERROR())
            }
        });
    }

    getOne(key) {
        return new Promise(async (resolve, reject) => {
            try {   
                const result = await this.catdb.doQuery(getSql, [key]);
                if(result.queryResult.length > 0) {
                    resolve(result.queryResult[0]);
                }
                else {
                    resolve(MESSAGES.NOT_FOUND(PRIMARY_KEY, key));
                }
            }
            catch(error) {
                reject(MESSAGES.PROGRAM_ERROR());
            }
        });
    }

    insert(cat) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.catdb.doQuery(insertSql, toArrayInsert(cat));
                resolve(MESSAGES.INSERT_OK(PRIMARY_KEY, cat[PRIMARY_KEY]));
            }
            catch(error) {
                reject(MESSAGES.NOT_INSERTED());
            }
        });
    }

    update(key, cat) {
        return new Promise (async (resolve, reject) => {
            try {
                if(key && cat) {
                    if(cat[PRIMARY_KEY] != key) {
                        reject(MESSAGES.KEYS_DO_NOT_MATCH(key, cat[PRIMARY_KEY]));
                    }
                    else {
                        const resultGet = await this.catdb.doQuery(getSql, [key]);
                        if(resultGet.queryResult.length > 0) {
                            const result = await this.catdb.doQuery(updateSql, toArrayUpdate(cat));
                            if(result.queryResult.rowsChanged === 0) {
                                resolve(MESSAGES.NOT_UPDATED());
                            }
                            else {
                                resolve(MESSAGES.UPDATE_OK(PRIMARY_KEY, cat[PRIMARY_KEY]));
                            }
                        }
                        else {
                            this.insert(cat)
                            .then(status => resolve(status))
                            .catch(error => reject(error));
                        }
                    }
                }
                else {
                    reject(MESSAGES.NOT_UPDATED());
                }
            }
            catch(error) {
                reject(MESSAGES.NOT_UPDATED());
            }
        });
    }

    remove(key) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.catdb.doQuery(removeSql, [key]);
                if(result.queryResult.rowsChanged === 1) {
                    resolve(MESSAGES.DELETE_OK(PRIMARY_KEY, key));
                }
                else {
                    resolve(MESSAGES.NOT_DELETED(PRIMARY_KEY, key));
                }
            }
            catch(error) {
                reject(MESSAGES.PROGRAM_ERROR());
            }
        });
    }
}