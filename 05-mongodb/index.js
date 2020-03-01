const express = require("express")
const app = express()
const path = require('path')
const mongo = require("./models/db")
// const testdata = require("./initData")

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./index.html"))
})

app.get("/api/list", async (req, res) => {
    // 分页查询
    const { page} = req.query
    try {
        // 切换到fruits集合
        const col = mongo.col("fruits")
        // 总数量
        const total = await col.find().count()
        const fruits = await col
            .find()
            .skip((page - 1) * 5)// 比如在第二页，则跳过第一页的五条
            .limit(5)// 每页限制五条
            .toArray()
        res.json({ ok: 1, data: { fruits, pagination: { total, page } } })
    } catch (error) {
        console.log(error)
    }
})

app.get("/api/category", async (req, res) => {
    const col = mongo.col("fruits")
    const data = await col.distinct('category')
    res.json({ ok: 1, data })
})

app.listen(3000)
