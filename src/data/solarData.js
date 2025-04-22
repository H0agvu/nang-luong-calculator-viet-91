
export const solarPanels = [
  {
    id: "longi-645",
    name: "Longi 645W",
    width: 1134,
    length: 2384,
    efficiency: 1,
    power: 645
  },
  {
    id: "ja-solar-550",
    name: "JA Solar 550W",
    width: 1052,
    length: 2274,
    efficiency: 0.98,
    power: 550
  },
  {
    id: "jinko-530",
    name: "Jinko 530W",
    width: 1030,
    length: 2252,
    efficiency: 0.97,
    power: 530
  },
  {
    id: "trina-620",
    name: "Trina 620W",
    width: 1096,
    length: 2324,
    efficiency: 0.99,
    power: 620
  }
];

export const inverters = [
  { id: "solis-3", name: "Solis 3kW", power: 3, efficiency: 98, mpptCount: 4 },
  { id: "solis-5", name: "Solis 5kW", power: 5, efficiency: 98, mpptCount: 4 },
  { id: "solis-10", name: "Solis 10kW", power: 10, efficiency: 98, mpptCount: 6 },
  { id: "solis-15", name: "Solis 15kW", power: 15, efficiency: 98, mpptCount: 6 },
  { id: "solis-20", name: "Solis 20kW", power: 20, efficiency: 98, mpptCount: 8 },
  { id: "solis-30", name: "Solis 30kW", power: 30, efficiency: 98, mpptCount: 8 },
  { id: "solis-40", name: "Solis 40kW", power: 40, efficiency: 98, mpptCount: 8 },
  { id: "solis-50", name: "Solis 50kW", power: 50, efficiency: 98, mpptCount: 10 },
  { id: "solis-60", name: "Solis 60kW", power: 60, efficiency: 98, mpptCount: 12 },
  { id: "solis-80", name: "Solis 80kW", power: 80, efficiency: 98, mpptCount: 16 },
  { id: "solis-100", name: "Solis 100kW", power: 100, efficiency: 98, mpptCount: 20 },
  { id: "solis-110", name: "Solis 110kW", power: 110, efficiency: 98, mpptCount: 20 },
  { id: "solis-125", name: "Solis 125kW", power: 125, efficiency: 98, mpptCount: 20 },
];

export const standardMCCBRatings = [
  10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6300
];

export const cableSizes = [
  {
    size: 1.5,
    current: {
      pvc: {
        multiCore: { twoLoad: 22, threeLoad: 18.5 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 26, threeLoad: 23 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      }
    }
  },
  // ... Giữ nguyên phần còn lại của dữ liệu cáp
];
