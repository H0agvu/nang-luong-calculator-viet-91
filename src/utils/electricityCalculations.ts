
interface ElectricityBlock {
  width: number;
  price: number;
}

const BLOCKS: ElectricityBlock[] = [
  { width: 50, price: 1893 },
  { width: 50, price: 1956 },
  { width: 100, price: 2271 },
  { width: 100, price: 2860 },
  { width: 100, price: 3197 },
  { width: Infinity, price: 3302 },
];

export const calculateElectricityConsumption = (totalMoney: number, hasVAT: boolean = false) => {
  const netMoney = hasVAT ? totalMoney / 1.1 : totalMoney;
  let remainingMoney = netMoney;
  let totalKwh = 0;
  let breakdownByLevel: { kwh: number; cost: number }[] = [];

  for (const block of BLOCKS) {
    const costForFullBlock = block.width * block.price;
    
    if (remainingMoney >= costForFullBlock) {
      totalKwh += block.width;
      remainingMoney -= costForFullBlock;
      breakdownByLevel.push({
        kwh: block.width,
        cost: costForFullBlock
      });
    } else {
      const partialKwh = remainingMoney / block.price;
      totalKwh += partialKwh;
      breakdownByLevel.push({
        kwh: partialKwh,
        cost: remainingMoney
      });
      break;
    }
  }

  return {
    totalKwh: Math.round(totalKwh * 100) / 100,
    breakdownByLevel
  };
};
