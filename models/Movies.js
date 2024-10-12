const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  Source: { type: String },
  Value: { type: String },
});

const MovieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Year: { type: String, required: true },
  Rated: { type: String },
  Released: { type: String },
  Runtime: { type: String },
  Genre: { type: String },
  Director: { type: String },
  Writer: { type: String },
  Actors: { type: String },
  Plot: { type: String },
  Language: { type: String },
  Country: { type: String },
  Awards: { type: String },
  Poster: { type: String },
  Ratings: [RatingSchema],
  Metascore: { type: String },
  imdbRating: { type: String },
  imdbVotes: { type: String },
  imdbID: { type: String, required: true },
  Type: { type: String },
  DVD: { type: String },
  BoxOffice: { type: String },
  Production: { type: String },
  Website: { type: String },
  LowUrl: { type: String},
  HdUrl: { type: String},
  FullHdUrl: { type: String},
  QhdUrl: { type: String},
},{
  timestamps: true
});

module.exports = mongoose.model('Movie', MovieSchema);
