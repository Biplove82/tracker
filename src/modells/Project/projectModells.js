const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  
     village: { type: String, trim: true },
  district: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true },
  landmark: { type: String, trim: true },

 
 });

const documentSchema = new mongoose.Schema({
  doc_type: {
    type: String,
    enum: ["Aadhar", "PAN", "Land Ownership", "Electricity Bill", "Other"],
  },
  doc_url: { type: String },
  uploaded_on: { type: Date, default: Date.now },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "New",
      "Survey Pending",
      "Survey Completed",
      "Quotation Sent",
      "Advance Paid",
      "Installation Started",
      "Installation Completed",
      "Net Meter Applied",
      "Net Meter Installed",
      "Project Completed",
      "On Hold",
      "Cancelled",
    ],
    required: true,
  },
  remarks: { type: String },
  updated_by: { type: String },
  updated_on: { type: Date, default: Date.now },
});

// Main Project Schema
const projectSchema = new mongoose.Schema(
  {
    customer_name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    alt_phone: { type: String, trim: true },

    // CRM linking to Lead table
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },

    billing_address: addressSchema,
    site_address: addressSchema,

    project_name: { type: String, trim: true },
    project_group: { type: String, trim: true },

    project_category: {
      type: String,
      enum: ["Residential", "Commercial", "Industrial"],
    },

    project_kwp: { type: Number },
    project_type: {
      type: String,
      enum: ["On-Grid", "Off-Grid", "Hybrid"],
    },

    distance_from_office: { type: Number },
    tarrif: { type: String, trim: true },

    land_type: {
      type: String,
      enum: ["Rooftop", "Ground Mount", "Open Land"],
    },

    code: { type: String },

    // Status fields
    project_status: {
      type: String,
      enum: [
        "New",
        "Survey Pending",
        "Survey Completed",
        "Quotation Sent",
        "Advance Paid",
        "Installation Started",
        "Installation Completed",
        "Net Meter Applied",
        "Net Meter Installed",
        "Project Completed",
        "On Hold",
        "Cancelled",
      ],
      default: "New",
    },

    status_history: [statusHistorySchema],

    // Installation Details
    installer_name: { type: String },
    installer_team: [{ type: String }],

    submitted_by: { type: String, trim: true },

    billing_type: {
      type: String,
      enum: ["Cash", "Loan", "EMI", "Subsidy"],
    },

    // costing
    cost: {
      total_cost: { type: Number },
      advance_paid: { type: Number, default: 0 },
      remaining_amount: { type: Number },
    },

    documents: [documentSchema],

    // Auto timestamp for updates
    updated_on: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectDetail", projectSchema);
