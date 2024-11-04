const mongoose=require("mongoose");
const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authoriti_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References to municipal/authorities
  complaintNumber: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },
  attachments: [String], // Paths to uploaded files
  response: String, // Response text from authorities
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
ComplaintSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
const Complaint = mongoose.model("Complaint", ComplaintSchema);
module.exports = Complaint;
