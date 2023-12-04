
const inventoryData = () => {
  return {
    type: "INVENTORY_DATA"
  };
};

const decrement = () => {
  return {
    type: "DECREMENT"
  };
};

export default {
  inventoryData,
  decrement
};