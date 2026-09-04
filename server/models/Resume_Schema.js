import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Resume",
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    templateId: {
      type: String,
      enum: ["modern", "classic", "executive", "creative", "minimal", "tech"],
      default: "modern",
    },
    content: {
      personal: {
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        title: { type: String, default: "" },
      },
      summary: { type: String, default: "" },
      experience: [
        {
          id: String,
          company: String,
          position: String,
          location: String,
          startDate: String,
          endDate: String,
          current: { type: Boolean, default: false },
          description: String,
          bullets: [String],
        },
      ],
      education: [
        {
          id: String,
          institution: String,
          degree: String,
          field: String,
          location: String,
          startDate: String,
          endDate: String,
          current: { type: Boolean, default: false },
          gpa: String,
          honors: String,
        },
      ],
      skills: [
        {
          id: String,
          category: String,
          items: [String],
        },
      ],
      projects: [
        {
          id: String,
          name: String,
          description: String,
          technologies: [String],
          url: String,
          github: String,
          startDate: String,
          endDate: String,
        },
      ],
      certifications: [
        {
          id: String,
          name: String,
          issuer: String,
          date: String,
          url: String,
        },
      ],
      languages: [
        {
          id: String,
          language: String,
          proficiency: {
            type: String,
            enum: ["Native", "Fluent", "Advanced", "Intermediate", "Basic"],
          },
        },
      ],
    },
    atsScore: { type: Number, default: 0, min: 0, max: 100 },
    downloads: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    lastExportedAt: Date,
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ user: 1, updatedAt: -1 });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
