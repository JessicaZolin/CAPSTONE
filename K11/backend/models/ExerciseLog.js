import { model, Schema } from "mongoose";

const exerciseLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercise: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    weight: {
        value : {
          type: Number,
          required: true,
        },
        unit : {
          type: String,
          enum: ['kg'],
          default: 'kg',
        },
      },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ExerciseLog = model("ExerciseLog", exerciseLogSchema);
export default ExerciseLog;
