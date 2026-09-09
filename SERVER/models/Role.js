import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isSystemRole: {
      type: Boolean,
      default: false,
    },
    permissions: {
      userManagement: { type: String, enum: ["ALLOW", "DENY"], default: "DENY" },
      roleManagement: { type: String, enum: ["ALLOW", "DENY"], default: "DENY" },
      systemGovernance: { type: String, enum: ["ALLOW", "DENY"], default: "DENY" },
      catalogManagement: { type: String, enum: ["ALLOW", "DENY"], default: "ALLOW" },
      inventoryControl: { type: String, enum: ["ALLOW", "DENY"], default: "ALLOW" },
      orderLifecycle: { type: String, enum: ["ALLOW", "DENY"], default: "ALLOW" },
      fulfillmentShipping: { type: String, enum: ["ALLOW", "DENY"], default: "DENY" },
      marketingSales: { type: String, enum: ["ALLOW", "DENY"], default: "ALLOW" },
      reportsDashboard: { type: String, enum: ["ALLOW", "DENY"], default: "ALLOW" },
      crmSupport: { type: String, enum: ["ALLOW", "DENY"], default: "ALLOW" },
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
