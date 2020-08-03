const dbService = require('../../services/db.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    // getByEmail,
    remove,
    update,
    add
}
async function query(filterBy = {}) {

    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('house')

    try {
        const houses = await collection.find(criteria).toArray();
        return houses
    } catch (err) {
        console.log('ERROR: cannot find houses')
        throw err;
    }
}

async function getById(houseId) {
    const collection = await dbService.getCollection('house')
    try {
        const house = await collection.findOne({ "_id": ObjectId(houseId) })

        return house
    } catch (err) {
        throw err;
    }
}


async function remove(houseId) {
    const collection = await dbService.getCollection('house')
    try {
        await collection.deleteOne({ "_id": ObjectId(houseId) })
    } catch (err) {
        throw err;
    }
}

async function update(house) {
    const collection = await dbService.getCollection('house')
    house._id = ObjectId(house._id);

    try {
        await collection.replaceOne({ "_id": house._id }, { $set: house })
        return house
    } catch (err) {
        // console.log(`ERROR: cannot update house ${house._id}`)
        throw err;
    }
}

async function add(house) {
    const collection = await dbService.getCollection('house')
    try {
        await collection.insertOne(house);
        return house;
    } catch (err) {

        throw err;
    }
}


function _buildCriteria(filterBy) {
    const criteria = {};
    //search filter
    if (filterBy.location)
        criteria['location.name'] = { $regex: new RegExp(filterBy.location, 'i') };
    console.log(criteria['location.name'], 'location.name');
    //capacity filter
    var visitors = 0;
    if (+filterBy.adultNumber > 0) {
        visitors += +filterBy.adultNumber;
    }
    if (+filterBy.childrenNumber.length > 0) {
        visitors += +filterBy.childrenNumber;
    }
    criteria.capacity = { $gte: visitors }

    //type: entire house suggestion from homepage
    if (filterBy.type) {
        criteria.type = { $regex: new RegExp('entire house|villa', 'i') };
    }
    //top rating filter suggestion from homepage
    if (filterBy.rating) criteria['scores.rating'] = { $gte: +filterBy.rating }

    //date picker filter

    return criteria;
}