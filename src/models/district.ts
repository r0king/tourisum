import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  imageUrl: String,
});

const FoodSpotSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  description: String,
  location: String,
});

const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  description: String,
  location: String,
});

const DistrictSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  destinations: [DestinationSchema],
  foodSpots: [FoodSpotSchema],
  events: [EventSchema],
});

export default mongoose.models.District || mongoose.model('District', DistrictSchema);