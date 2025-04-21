
import { Inverter } from "@/interfaces/inverter";

export const inverters: Inverter[] = [
  {
    id: "solis-100",
    name: "Solis 100",
    power: 100,
    efficiency: 99,
    mpptCount: 20
  },
  {
    id: "huawei-60",
    name: "Huawei 60",
    power: 60,
    efficiency: 98,
    mpptCount: 12
  },
  {
    id: "sungrow-50",
    name: "Sungrow 50",
    power: 50,
    efficiency: 97,
    mpptCount: 10
  },
  {
    id: "sma-25",
    name: "SMA 25",
    power: 25,
    efficiency: 96,
    mpptCount: 5
  },
  {
    id: "growatt-40",
    name: "Growatt 40",
    power: 40,
    efficiency: 97,
    mpptCount: 8
  }
];
