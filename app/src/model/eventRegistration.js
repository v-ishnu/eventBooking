import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phoneNum: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  { _id: false }
);

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    participants: {
      type: [participantSchema],
      required: true
    },

    ticketCount: {
      type: Number,
      required: true,
      min: 1
    },

    payment: {
      amount: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
      },
      paymentId: String,
      orderId: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("EventRegistration", eventRegistrationSchema);
