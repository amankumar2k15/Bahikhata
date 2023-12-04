import axios from "axios";

export const RazorpayPayment = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const displayRazorpay = async () => {
  const res = await RazorpayPayment(
    "https://checkout.razorpay.com/v1/checkout.js"
  );
  const data = await fetch(
    "http://5ac1-2401-4900-1c09-3b64-79dc-bed7-a79b-9cf2.ngrok.io/payments/razorpay",
    {
      method: "POST",
    }
  );
  // const data1 = await axios.post(
  //   "https://154c-122-168-34-128.ngrok.io/payments/razorpay"
  // );
  let orderID;
  await data.json().then((res) => (orderID = res.orderID));

  var options = {
    key: "rzp_test_2BzeR16drptuXK",
    amount: "50000",
    currency: "INR",
    name: "Acme Corp",
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: orderID, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    callback_url:
      "http://5ac1-2401-4900-1c09-3b64-79dc-bed7-a79b-9cf2.ngrok.io/payments/paymentCallback",
    prefill: {
      name: "Gaurav Kumar",
      email: "gaurav.kumar@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const paymentObj = new window.Razorpay(options);
  paymentObj.open();
};
