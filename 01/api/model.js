const mongoose = require('mongoose')

// 创建集合规则
const courseSchema = new mongoose.Schema({
  name: String,
  age: Number,
})

// 创建集合并应用规则
const Course = mongoose.model('Course', courseSchema)

exports.Course = Course
