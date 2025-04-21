
export interface Inverter {
  id: string;
  name: string;
  power: number; // kW
  efficiency: number; // %
  mpptCount: number;
}
