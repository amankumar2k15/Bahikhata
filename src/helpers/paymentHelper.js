import { toast } from "react-toastify";
import { selectPlan, verifyPayment } from "../services/api.service";

export const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// const __DEV__ = document.domain === "localhost";

export const handlePayment = async (planData) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }
  const data = await selectPlan(planData.plans);

  const options = {
    key: "rzp_test_81AvpkJMa4k4bN", // Enter the Key ID generated from the Dashboard
    amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Bahi khata",
    description: "Test Transaction",
    image: "https://picsum.photos/200/300",
    order_id: data.data.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: async function (response) {
      const body = {
        order_id: response.razorpay_order_id,
        payment_id: response.razorpay_payment_id,
        signature: response.razorpay_signature,
        subscription_id: data.data.subscriptionId,
      };
      const verifiedData = await verifyPayment(body);

      if (
        verifiedData &&
        verifiedData?.data?.message === "payment verified and updated!"
      ) {
        toast.success("Payment verified!");
      }
    },
    prefill: {
      name: planData.firstName || "user name",
      email: planData.email || "email@example.com",
      contact: planData.mobile || 9999999999,
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  if (planData.plans !== "free") {
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      toast.error(response.error.description);
    });
    paymentObject.open();
  }
};
