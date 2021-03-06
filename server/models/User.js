const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
 id: { type: Number },
 username: { type: String },
 email: { type: String },
 password: { type: String },
 avatar: { type: String },
 friends: [{ type: Object }],
 games: [{ type: Object }],
 comments: [{ type: Object }],
 description: { type: String },
 favouriteGame: { type: Object },
 posts: [{ type: Object }],
 notifications: [{ type: Object }],
});

module.exports = model('User', schema);
