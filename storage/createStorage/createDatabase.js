'use strict';

const Database = require('../database');

const printMessage = message => console.log(message);
const printStatement = statement => printMessage(`${statement};`);
const printError = message => printMessage(`\n${'#'.repeat(20)}Error ${'#'.repeat(20)}
\n${message}\n${'#'.repeat(47)}`);

let createStatementsFile = './Remo_Kati_cat_createStatements.json';

if(process.argv.length>2) {
    createStatementsFile = `./${process.argv[2]}`;
}

try {
    createDb(require(createStatementsFile));
}
catch(error) {
    printError(error.message);
}

async function createDb(createStatements) {
    const options = {
        host: createStatements.host,
        port: createStatements.port,
        user: createStatements.user,
        password: createStatements.password
    };

    const DEBUG = createStatements.debug;
    const catdb = new Database(options);
    const user = `${createStatements.user}'@'${createStatements.host}`;
    const dropDatabaseSql = `drop database if exists ${createStatements.database}`;
    const createDatabaseSql = `create database ${createStatements.database}`;
    const dropUserSql = `drop user if exists ${user}`;
    const createUserSql = `create user if not exists ${user}` + 
    `identified by '${createStatements.userpassword}'`;
    const grantPrivilegesSql = `grant all privileges on ${createStatements.database}.* to ${user}`;

    try {
        await catdb.doQuery(dropDatabaseSql);
        if(DEBUG) { 
        printStatement(dropDatabaseSql);
        }

        await catdb.doQuery(createDatabaseSql);
        if(DEBUG) printStatement(createDatabaseSql);
        if(createStatements.dropUser) {
            await catdb.doQuery(dropUserSql);
            if(DEBUG) printStatement(dropUserSql);
        }
        await catdb.doQuery(createUserSql);
        if(DEBUG) printStatement(createUserSql);
        await catdb.doQuery(grantPrivilegesSql);
        if(DEBUG) printStatement(grantPrivilegesSql);

        for(let table of createStatements.tables) {
            if(table.columns && table.columns.length>0) {
                const createTableSql =
                `create table ${createStatements.database}.${table.tableName}(`+
                `\n\t${table.columns.join(',\n\t')}` + ')';

                await catdb.doQuery(createTableSql);
                if(DEBUG) printStatement(createTableSql);

                if(table.data && table.data.length>0) {
                    const rows = [];
                    for(let data of table.data) {
                        const insertSql =
                        `insert into ${createStatements.database}.${table.tableName}` + 
                        `values(${Array(data.length).fill('?').join(',')})`;
                        rows.push(catdb.doQuery(insertSql, data));
                    }
                    await Promise.all(rows);
                    if(DEBUG) printMessage('data added');
                }
                else {
                    if(DEBUG) printMessage('data missing');
                }
            }
            else {
                if(DEBUG) printMessage('Table columns missing. Table not created');
            }
        }
    }
    catch(error) {
        printError(error);
    }
}