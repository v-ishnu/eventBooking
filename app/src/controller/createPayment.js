import Cashfree from "../../config/cashfree.js";
import Event from "../model/event.js";
import EventRegistration from "../model/eventRegistration.js";

const createPayment = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registration = await EventRegistration.findById(registrationId).populate("event");
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const orderId = `EVT_${registrationId}_${Date.now()}`;

    const orderRequest = {
      order_id: orderId,
      order_amount: registration.payment.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: registrationId,
        customer_email: registration.participants[0].email,
        customer_phone: registration.participants[0].phoneNum
      },
      order_meta: {
        return_url: `http://localhost:8000/payment-success?order_id=${orderId}`
      }
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);

    // save orderId
    registration.payment.orderId = orderId;
    await registration.save();

    return res.json({
      success: true,
      paymentSessionId: response.data.payment_session_id
    });
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

export default createPayment;
