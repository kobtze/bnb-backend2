const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const _ = require('lodash');
var isEmpty = require('lodash/isEmpty');

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(reqQuery) {
    const criteria = _buildCriteria(reqQuery)
    if (isEmpty(criteria)) return Promise.reject('Bad request!')
    const orders = await _query(criteria)
    return orders
}

async function _query(criteria) {
    const collection = await dbService.getCollection('order')
    try {
        const orders = await collection.find(criteria).toArray();
        return orders
    } catch (err) {
        console.log('ERROR: cannot find orders')
        throw err;
    }
}

async function getById(orderId) {
    const collection = await dbService.getCollection('order')
    try {
        const order = await collection.findOne({ "_id": ObjectId(orderId) })
        return order
    } catch (err) {
        console.log(`ERROR: while finding order ${orderId}`)
        throw err;
    }
}

async function remove(orderId) {
    const collection = await dbService.getCollection('order')
    try {
        await collection.deleteOne({ "_id": ObjectId(orderId) })
    } catch (err) {
        console.log(`ERROR: cannot remove order ${orderId}`)
        throw err;
    }
}

async function update(order) {
    const collection = await dbService.getCollection('order')
    order._id = ObjectId(order._id);

    try {
        await collection.replaceOne({ "_id": order._id }, { $set: order })
        return order
    } catch (err) {
        console.log(`ERROR: cannot update order ${order._id}`)
        throw err;
    }
}

async function add(order) {
    const collection = await dbService.getCollection('order')
    order.createdAt = Date.now()
    try {
        await collection.insertOne(order);
        return order;
    } catch (err) {
        console.log(`ERROR: cannot insert order`)
        throw err;
    }
}

function _buildCriteria(reqQuery) {
    const criteria = {}
    const userId = reqQuery.userId
    if (userId) {
        criteria.$or = [{'guest._id' : userId},{'host._id' : userId}]
    }
    return criteria;
}
