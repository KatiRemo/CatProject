'use strict';

const toArrayInsert = cat => [
    +cat.number, cat.name, +cat.length, +cat.weightKg, cat.breed
];

const toArrayUpdate = cat => [
    cat.name, +cat.length, +cat.weightKg, cat.breed, +cat.number
];

module.exports = { toArrayInsert, toArrayUpdate };