const orderService = require('./order.service')
const logger = require('../../services/logger.service')

async function getOrder(req, res) {
    const order = await orderService.getById(req.params.id)
    res.send(order)
}

async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query)
        logger.debug(orders);
        res.send(orders)
    } catch (err) {
        res.status(401).send({ Error: err })
    }
}

async function deleteOrder(req, res) {
    await orderService.remove(req.params.id)
    res.end()
}

async function updateOrder(req, res) {
    const order = req.body;
    await orderService.update(order)
    res.send(order)
}

async function addOrder(req, res) {
    const order = req.body;
    await orderService.add(order)
    res.send(order)
}

module.exports = {
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder,
    addOrder
}