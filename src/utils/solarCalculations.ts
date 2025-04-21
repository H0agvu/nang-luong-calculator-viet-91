
import { Inverter, cableSizes, standardMCCBRatings } from "@/data/solarData";

export interface InverterCombination {
  inverters: { inverter: Inverter; count: number }[];
  totalPower: number;
  deviation: number;
  averagePower: number;
}

// Hàm tính tổng công suất
export const calculateTotalPower = (panelPower: number, panelCount: number): number => {
  return panelPower * panelCount;
};

// Hàm tính công suất tìm inverter
export const calculateInverterPower = (totalPower: number): number => {
  return totalPower / 1.2;
};

// Hàm tìm tổ hợp inverter tối ưu
export const findOptimalInverterCombination = (
  requiredPower: number,
  availableInverters: Inverter[]
): InverterCombination => {
  // Sắp xếp inverter theo công suất giảm dần
  const sortedInverters = [...availableInverters].sort((a, b) => b.power - a.power);
  
  let bestCombination: InverterCombination = {
    inverters: [],
    totalPower: 0,
    deviation: Infinity,
    averagePower: 0,
  };

  // Kiểm tra trường hợp đơn giản: chia hết
  for (const inverter of sortedInverters) {
    const count = Math.round(requiredPower / inverter.power);
    if (count > 0) {
      const totalPower = count * inverter.power;
      const deviation = Math.abs(totalPower - requiredPower) / requiredPower;
      
      // Nếu sai lệch ≤ 5% và tổng công suất không vượt quá 110%
      if (deviation <= 0.05 && totalPower <= requiredPower * 1.1) {
        const combination: InverterCombination = {
          inverters: [{ inverter, count }],
          totalPower,
          deviation,
          averagePower: totalPower / count,
        };
        
        if (isBetterCombination(combination, bestCombination)) {
          bestCombination = combination;
        }
      }
    }
  }

  // Tìm tổ hợp với 2 loại inverter
  for (let i = 0; i < sortedInverters.length; i++) {
    for (let j = i; j < sortedInverters.length; j++) {
      const inverter1 = sortedInverters[i];
      const inverter2 = sortedInverters[j];
      
      // Giới hạn chênh lệch giữa các inverter ≤ 60%
      if (inverter1.power / inverter2.power > 1.6) continue;
      
      // Thử các tổ hợp số lượng
      for (let count1 = 1; count1 <= 5; count1++) {
        for (let count2 = 0; count2 <= 5; count2++) {
          if (count2 === 0 && j === i) continue; // Tránh trường hợp trùng lặp
          if (count1 + count2 > 10) continue; // Giới hạn số lượng
          
          const totalPower = count1 * inverter1.power + count2 * inverter2.power;
          const deviation = Math.abs(totalPower - requiredPower) / requiredPower;
          
          // Nếu sai lệch ≤ 5% và tổng công suất không vượt quá 110%
          if (deviation <= 0.05 && totalPower <= requiredPower * 1.1) {
            const inverters = [];
            if (count1 > 0) inverters.push({ inverter: inverter1, count: count1 });
            if (count2 > 0) inverters.push({ inverter: inverter2, count: count2 });
            
            const combination: InverterCombination = {
              inverters,
              totalPower,
              deviation,
              averagePower: totalPower / (count1 + count2),
            };
            
            if (isBetterCombination(combination, bestCombination)) {
              bestCombination = combination;
            }
          }
        }
      }
    }
  }

  // Tìm tổ hợp với 3 loại inverter
  for (let i = 0; i < sortedInverters.length; i++) {
    for (let j = i; j < sortedInverters.length; j++) {
      for (let k = j; k < sortedInverters.length; k++) {
        const inverter1 = sortedInverters[i];
        const inverter2 = sortedInverters[j];
        const inverter3 = sortedInverters[k];
        
        // Giới hạn chênh lệch giữa các inverter ≤ 60%
        if (inverter1.power / inverter3.power > 1.6) continue;
        
        // Thử các tổ hợp số lượng (giới hạn để giảm thời gian tính toán)
        for (let count1 = 1; count1 <= 3; count1++) {
          for (let count2 = 0; count2 <= 3; count2++) {
            for (let count3 = 0; count3 <= 3; count3++) {
              if ((count2 === 0 && j === i) || (count3 === 0 && k === j)) continue; // Tránh trường hợp trùng lặp
              if (count1 + count2 + count3 > 10) continue; // Giới hạn số lượng
              
              const totalPower = count1 * inverter1.power + count2 * inverter2.power + count3 * inverter3.power;
              const deviation = Math.abs(totalPower - requiredPower) / requiredPower;
              
              // Nếu sai lệch ≤ 5% và tổng công suất không vượt quá 110%
              if (deviation <= 0.05 && totalPower <= requiredPower * 1.1) {
                const inverters = [];
                if (count1 > 0) inverters.push({ inverter: inverter1, count: count1 });
                if (count2 > 0) inverters.push({ inverter: inverter2, count: count2 });
                if (count3 > 0) inverters.push({ inverter: inverter3, count: count3 });
                
                const combination: InverterCombination = {
                  inverters,
                  totalPower,
                  deviation,
                  averagePower: totalPower / (count1 + count2 + count3),
                };
                
                if (isBetterCombination(combination, bestCombination)) {
                  bestCombination = combination;
                }
              }
            }
          }
        }
      }
    }
  }

  return bestCombination;
};

// Hàm so sánh 2 tổ hợp inverter
const isBetterCombination = (
  newCombination: InverterCombination,
  bestCombination: InverterCombination
): boolean => {
  // Nếu chưa có tổ hợp nào, hoặc tổ hợp mới có số lượng ít hơn
  if (
    bestCombination.inverters.length === 0 ||
    getTotalInverterCount(newCombination) < getTotalInverterCount(bestCombination)
  ) {
    return true;
  }
  
  // Nếu số lượng bằng nhau, xét theo sai lệch
  if (getTotalInverterCount(newCombination) === getTotalInverterCount(bestCombination)) {
    if (newCombination.deviation < bestCombination.deviation) {
      return true;
    }
    
    // Nếu sai lệch bằng nhau, xét theo công suất trung bình
    if (Math.abs(newCombination.deviation - bestCombination.deviation) < 0.001) {
      return newCombination.averagePower > bestCombination.averagePower;
    }
  }
  
  return false;
};

// Hàm tính tổng số inverter
const getTotalInverterCount = (combination: InverterCombination): number => {
  return combination.inverters.reduce((total, item) => total + item.count, 0);
};

// Hàm tính tỷ số DC/AC
export const calculateDCACRatio = (inverterPower: number, totalPower: number): number => {
  return inverterPower / totalPower;
};

// Hàm tính dòng điện
export const calculateCurrent = (power: number, voltage: number, phase: string, efficiency: number): number => {
  if (phase === "1P") {
    return (power * 1000) / (voltage * efficiency / 100);
  } else { // 3P
    return (power * 1000) / (Math.sqrt(3) * voltage * efficiency / 100);
  }
};

// Hàm tìm MCCB phù hợp
export const findSuitableMCCB = (current: number): number => {
  // Tìm loại MCCB có dòng định mức cao hơn gần nhất
  return standardMCCBRatings.find(rating => rating >= current) || standardMCCBRatings[standardMCCBRatings.length - 1];
};

// Hàm tìm cáp phù hợp
export interface CableSelection {
  type: string;
  count: number;
  mainCableSize: number;
  neutralCableSize: number;
}

export const findSuitableCable = (
  current: number, 
  phase: string, 
  coreType: "single" | "multi",
  insulationType: "PVC" | "XLPE",
  installationType: "underground" | "air"
): CableSelection => {
  // Giá trị mặc định cho trường hợp không tìm được
  let result: CableSelection = {
    type: "",
    count: 1,
    mainCableSize: 0,
    neutralCableSize: 0
  };
  
  // Xác định phương pháp chọn cáp
  const multiCore = coreType === "multi";
  const pvc = insulationType === "PVC";
  
  let maxCurrent = 0;
  let selectedSize = 0;
  
  // Tìm cáp phù hợp
  for (const cable of cableSizes) {
    let cableCurrent = 0;
    
    if (multiCore) {
      cableCurrent = pvc 
        ? (phase === "1P" ? cable.current.pvc.multiCore.twoLoad : cable.current.pvc.multiCore.threeLoad)
        : (phase === "1P" ? cable.current.xlpe.multiCore.twoLoad : cable.current.xlpe.multiCore.threeLoad);
    } else {
      // Với cáp 1 lõi, giả định cách lắp đặt là dạng tam giác cho 3P và 2 lõi mang tải cho 1P
      cableCurrent = pvc
        ? (phase === "1P" ? cable.current.pvc.singleCore.twoLoad : cable.current.pvc.singleCore.threeTriangle)
        : (phase === "1P" ? cable.current.xlpe.singleCore.twoLoad : cable.current.xlpe.singleCore.threeTriangle);
    }
    
    // Bỏ qua nếu không có thông số
    if (cableCurrent === 0) continue;
    
    maxCurrent = cableCurrent;
    selectedSize = cable.size;
    
    // Nếu dòng điện phù hợp thì dừng lại
    if (cableCurrent >= current) break;
  }
  
  // Nếu không tìm được cáp phù hợp, tính số lượng cáp cần thiết
  if (maxCurrent < current && maxCurrent > 0) {
    const count = Math.ceil(current / maxCurrent);
    result = {
      type: `${count}x(${phase === "3P" ? "3x" : "2x"}${selectedSize}+1x${getNeutralSize(selectedSize)}mm²)`,
      count,
      mainCableSize: selectedSize,
      neutralCableSize: getNeutralSize(selectedSize)
    };
  } else if (maxCurrent >= current) {
    // Nếu tìm được cáp phù hợp
    result = {
      type: `${phase === "3P" ? "3x" : "2x"}${selectedSize}+1x${getNeutralSize(selectedSize)}mm²`,
      count: 1,
      mainCableSize: selectedSize,
      neutralCableSize: getNeutralSize(selectedSize)
    };
  }
  
  // Thêm thông tin vỏ cáp
  result.type = `0.6/1kV-CU/${insulationType}/PVC-${result.type}`;
  
  return result;
};

// Hàm tính kích thước dây trung tính
const getNeutralSize = (mainSize: number): number => {
  const halfSize = mainSize / 2;
  
  // Tìm kích thước tiêu chuẩn gần với nửa kích thước cáp chính
  const standardSizes = cableSizes.map(cable => cable.size);
  
  // Tìm kích thước lớn hơn hoặc bằng gần nhất
  return standardSizes.find(size => size >= halfSize) || mainSize;
};
