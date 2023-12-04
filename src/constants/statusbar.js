export const dashboard = [
  {
    title: "Dashboards",
    type: "dashboard",
    leftText: "Available Inventory",
    leftAmount: 0,
    rightText: "Inventory Value",
    rightAmount: 0,
    path: "/dashboard",
    dataKey: "totalInventory"
  },
  {
    title: "Purchase",
    type: "purchase",
    leftText: "Items Purchased Today",
    leftAmount: 0,
    rightText: "Today's Expense",
    rightAmount: 0,
    path: "/purchase",
    dataKey: "totalPurchase"
  },
  {
    title: "Sales",
    type: "sales",
    leftText: "Items Sold Today",
    leftAmount: 0,
    rightText: "Today's Sales(Earning)",
    rightAmount: 0,
    path: "/sales",
    dataKey: "totalSold"
  }
];

export const khata = [
  {
    title: "Creditors",
    type: "khata",
    heading: "Amount You Will Give (Sundry Creditors)",
    subHeading: "0",
    dataKey: "creditors",
    path: "/khata"
  },
  {
    title: "Debtors",
    type: "debtors",
    heading: "Amount You Will Get (Sundry Debtors)",
    subHeading: "0",
    dataKey: "debtors",
    path: "/debtors"
  },
  {
    title: "Client khata",
    type: "clientkhata",
    heading: "Individual Client Khata",
    subHeading: "Khata",
    dataKey: "clientkhata",
    path: "/clientkhata"
  }
];

// const navItemList = [
//   {
//     label: "Dashboard",
//     type: "dashboard",
//     icon: "columns",
//     dataKey: "inventory"
//   },
//   {
//     label: "Khata",
//     type: "khata",
//     icon: "book-open",
//     dataKey: "khata"
//   }
// ];

const StatusBarConstant = {
  dashboard,
  khata
  // dashboard: {
  //   title: "Dashboards",
  //   leftText: "Available Inventory",
  //   leftAmount: 0,
  //   rightText: "Inventory Value",
  //   rightAmount: 0,
  //   path: "/dashboard",
  //   dataKey: "totalInventory"
  // },
  // purchase: {
  //   title: "Purchase",
  //   leftText: "Items Purchased Today",
  //   leftAmount: 0,
  //   rightText: "Today's Expense",
  //   rightAmount: 0,
  //   path: "/purchase",
  //   dataKey: "totalPurchase"
  // },
  // sales: {
  //   title: "Sales",
  //   leftText: "Items Sold Today",
  //   leftAmount: 0,
  //   rightText: "Today's Sales(Earning)",
  //   rightAmount: 0,
  //   path: "/sales",
  //   dataKey: "totalSold"
  // },
  // khata: {
  //   title: "Creditors",
  //   heading: "Amount You Will Give (Sundry Creditors)",
  //   subHeading: "0",
  //   dataKey: "creditors",
  //   path: "/khata"
  // },
  // debtors: {
  //   title: "Debtors",
  //   heading: "Amount You Will Get (Sundry Debtors)",
  //   subHeading: "0",
  //   dataKey: "debtors",
  //   path: "/debtors"
  // },
  // clientkhata: {
  //   title: "Client khata",
  //   heading: "Individual client khata",
  //   subHeading: "Khata",
  //   dataKey: "clientkhata",
  //   path: "/clientkhata"
  // }
};

export default StatusBarConstant;
