// [REQUIRE] //
const mongoose = require('mongoose')


// [SCEMA] //
const Schema = mongoose.Schema


// [SCHEMA MODEL] //
const personSchema = Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	age: Number,
	stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
})


// [SCHEMA MODEL] //
const storySchema = Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'Person'
	},
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
})


const Story = mongoose.model('Story', storySchema)
const Person = mongoose.model('Person', personSchema)