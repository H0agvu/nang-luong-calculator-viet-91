export interface SolarPanel {
  id: string;
  name: string;
  width: number; // mm
  length: number; // mm
  efficiency: number;
  power: number; // W
}

export interface Inverter {
  id: string;
  name: string;
  power: number; // kW
  efficiency: number; // %
  mpptCount: number;
}

export const solarPanels: SolarPanel[] = [
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

export const inverters: Inverter[] = [
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

export interface CableSize {
  size: number; // mm²
  current: {
    pvc: {
      multiCore: {
        twoLoad: number; // 1P
        threeLoad: number; // 3P
      },
      singleCore: {
        twoLoad: number;
        threeTriangle: number;
        threeFlat: {
          adjacent: number;
          spaced: {
            horizontal: number;
            vertical: number;
          }
        }
      }
    },
    xlpe: {
      multiCore: {
        twoLoad: number; // 1P
        threeLoad: number; // 3P
      },
      singleCore: {
        twoLoad: number;
        threeTriangle: number;
        threeFlat: {
          adjacent: number;
          spaced: {
            horizontal: number;
            vertical: number;
          }
        }
      }
    }
  }
}

export const cableSizes: CableSize[] = [
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
  {
    size: 2.5,
    current: {
      pvc: {
        multiCore: { twoLoad: 30, threeLoad: 25 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 36, threeLoad: 32 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      }
    }
  },
  {
    size: 4,
    current: {
      pvc: {
        multiCore: { twoLoad: 40, threeLoad: 34 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 49, threeLoad: 42 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      }
    }
  },
  {
    size: 6,
    current: {
      pvc: {
        multiCore: { twoLoad: 51, threeLoad: 43 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 63, threeLoad: 54 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      }
    }
  },
  {
    size: 10,
    current: {
      pvc: {
        multiCore: { twoLoad: 70, threeLoad: 60 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 86, threeLoad: 75 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      }
    }
  },
  {
    size: 16,
    current: {
      pvc: {
        multiCore: { twoLoad: 94, threeLoad: 80 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 115, threeLoad: 100 },
        singleCore: { twoLoad: 0, threeTriangle: 0, threeFlat: { adjacent: 0, spaced: { horizontal: 0, vertical: 0 } } }
      }
    }
  },
  {
    size: 25,
    current: {
      pvc: {
        multiCore: { twoLoad: 119, threeLoad: 101 },
        singleCore: { twoLoad: 131, threeTriangle: 110, threeFlat: { adjacent: 114, spaced: { horizontal: 146, vertical: 130 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 149, threeLoad: 127 },
        singleCore: { twoLoad: 161, threeTriangle: 135, threeFlat: { adjacent: 141, spaced: { horizontal: 182, vertical: 161 } } }
      }
    }
  },
  {
    size: 35,
    current: {
      pvc: {
        multiCore: { twoLoad: 148, threeLoad: 126 },
        singleCore: { twoLoad: 162, threeTriangle: 137, threeFlat: { adjacent: 143, spaced: { horizontal: 181, vertical: 162 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 185, threeLoad: 158 },
        singleCore: { twoLoad: 200, threeTriangle: 169, threeFlat: { adjacent: 176, spaced: { horizontal: 226, vertical: 201 } } }
      }
    }
  },
  {
    size: 50,
    current: {
      pvc: {
        multiCore: { twoLoad: 180, threeLoad: 153 },
        singleCore: { twoLoad: 196, threeTriangle: 167, threeFlat: { adjacent: 174, spaced: { horizontal: 219, vertical: 197 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 225, threeLoad: 192 },
        singleCore: { twoLoad: 242, threeTriangle: 207, threeFlat: { adjacent: 216, spaced: { horizontal: 275, vertical: 246 } } }
      }
    }
  },
  {
    size: 70,
    current: {
      pvc: {
        multiCore: { twoLoad: 232, threeLoad: 196 },
        singleCore: { twoLoad: 251, threeTriangle: 216, threeFlat: { adjacent: 225, spaced: { horizontal: 281, vertical: 254 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 289, threeLoad: 246 },
        singleCore: { twoLoad: 310, threeTriangle: 268, threeFlat: { adjacent: 279, spaced: { horizontal: 353, vertical: 318 } } }
      }
    }
  },
  {
    size: 95,
    current: {
      pvc: {
        multiCore: { twoLoad: 282, threeLoad: 238 },
        singleCore: { twoLoad: 304, threeTriangle: 264, threeFlat: { adjacent: 275, spaced: { horizontal: 341, vertical: 311 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 352, threeLoad: 298 },
        singleCore: { twoLoad: 377, threeTriangle: 328, threeFlat: { adjacent: 342, spaced: { horizontal: 430, vertical: 389 } } }
      }
    }
  },
  {
    size: 120,
    current: {
      pvc: {
        multiCore: { twoLoad: 328, threeLoad: 276 },
        singleCore: { twoLoad: 352, threeTriangle: 308, threeFlat: { adjacent: 321, spaced: { horizontal: 396, vertical: 362 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 410, threeLoad: 346 },
        singleCore: { twoLoad: 437, threeTriangle: 383, threeFlat: { adjacent: 400, spaced: { horizontal: 500, vertical: 454 } } }
      }
    }
  },
  {
    size: 150,
    current: {
      pvc: {
        multiCore: { twoLoad: 379, threeLoad: 319 },
        singleCore: { twoLoad: 406, threeTriangle: 356, threeFlat: { adjacent: 372, spaced: { horizontal: 456, vertical: 419 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 473, threeLoad: 399 },
        singleCore: { twoLoad: 504, threeTriangle: 444, threeFlat: { adjacent: 464, spaced: { horizontal: 577, vertical: 527 } } }
      }
    }
  },
  {
    size: 185,
    current: {
      pvc: {
        multiCore: { twoLoad: 434, threeLoad: 364 },
        singleCore: { twoLoad: 463, threeTriangle: 409, threeFlat: { adjacent: 427, spaced: { horizontal: 521, vertical: 480 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 542, threeLoad: 456 },
        singleCore: { twoLoad: 575, threeTriangle: 510, threeFlat: { adjacent: 533, spaced: { horizontal: 661, vertical: 605 } } }
      }
    }
  },
  {
    size: 240,
    current: {
      pvc: {
        multiCore: { twoLoad: 514, threeLoad: 430 },
        singleCore: { twoLoad: 546, threeTriangle: 485, threeFlat: { adjacent: 507, spaced: { horizontal: 615, vertical: 569 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 641, threeLoad: 533 },
        singleCore: { twoLoad: 679, threeTriangle: 607, threeFlat: { adjacent: 634, spaced: { horizontal: 781, vertical: 719 } } }
      }
    }
  },
  {
    size: 300,
    current: {
      pvc: {
        multiCore: { twoLoad: 593, threeLoad: 497 },
        singleCore: { twoLoad: 629, threeTriangle: 561, threeFlat: { adjacent: 587, spaced: { horizontal: 709, vertical: 659 } } }
      },
      xlpe: {
        multiCore: { twoLoad: 741, threeLoad: 621 },
        singleCore: { twoLoad: 783, threeTriangle: 703, threeFlat: { adjacent: 736, spaced: { horizontal: 902, vertical: 833 } } }
      }
    }
  }
];

export const standardMCCBRatings = [
  10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6300
];
