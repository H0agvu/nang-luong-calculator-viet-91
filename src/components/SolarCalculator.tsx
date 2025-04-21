
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolarPanel, inverters } from "@/data/solarData";
import PanelSelection from "./PanelSelection";
import InverterSelection from "./InverterSelection";
import WiringCalculator from "./WiringCalculator";
import { 
  calculateTotalPower, 
  calculateInverterPower, 
  findOptimalInverterCombination,
  calculateDCACRatio,
  InverterCombination
} from "@/utils/solarCalculations";

const SolarCalculator = () => {
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);
  const [totalPanels, setTotalPanels] = useState<number>(0);
  const [strings, setStrings] = useState<number>(0);
  const [panelsPerString, setPanelsPerString] = useState<number>(0);
  
  const [totalPower, setTotalPower] = useState<number>(0);
  const [inverterPower, setInverterPower] = useState<number>(0);
  const [inverterCombination, setInverterCombination] = useState<InverterCombination | null>(null);
  const [dcAcRatio, setDcAcRatio] = useState<number>(0);
  
  const [activeTab, setActiveTab] = useState<string>("input");

  // Tính toán công suất tổng và công suất inverter
  useEffect(() => {
    if (selectedPanel && totalPanels > 0) {
      const power = calculateTotalPower(selectedPanel.power, totalPanels);
      setTotalPower(power);
      
      const invPower = calculateInverterPower(power);
      setInverterPower(invPower);
      
      // Tìm tổ hợp inverter tối ưu
      const combination = findOptimalInverterCombination(invPower / 1000, inverters);
      setInverterCombination(combination);
      
      // Tính tỷ số DC/AC
      if (combination.totalPower > 0) {
        const ratio = calculateDCACRatio(combination.totalPower * 1000, power);
        setDcAcRatio(ratio);
      }
    } else {
      setTotalPower(0);
      setInverterPower(0);
      setInverterCombination(null);
      setDcAcRatio(0);
    }
  }, [selectedPanel, totalPanels]);

  const handlePanelChange = (panel: SolarPanel | null) => {
    setSelectedPanel(panel);
  };

  const handleTotalPanelsChange = (total: number) => {
    setTotalPanels(total);
  };

  const handleStringsChange = (count: number) => {
    setStrings(count);
  };

  const handlePanelsPerStringChange = (count: number) => {
    setPanelsPerString(count);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Công cụ tính toán hệ thống điện năng lượng mặt trời</h1>
        <p className="text-gray-600 mt-2">Tính toán thiết bị điện của hệ thống pin mặt trời</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="input">Nhập liệu</TabsTrigger>
          <TabsTrigger value="output">Kết quả Inverter</TabsTrigger>
          <TabsTrigger value="wiring" disabled={!inverterCombination}>Tính dây và MCCB</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input">
          <PanelSelection 
            onPanelChange={handlePanelChange}
            onTotalPanelsChange={handleTotalPanelsChange}
            onStringsChange={handleStringsChange}
            onPanelsPerStringChange={handlePanelsPerStringChange}
          />
          
          {selectedPanel && totalPanels > 0 && (
            <div className="mt-4 text-right">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => setActiveTab("output")}
              >
                Xem kết quả
              </button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="output">
          <InverterSelection
            totalPower={totalPower}
            inverterPower={inverterPower}
            inverterCombination={inverterCombination}
            dcAcRatio={dcAcRatio}
          />
          
          {inverterCombination && (
            <div className="mt-4 flex justify-between">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                onClick={() => setActiveTab("input")}
              >
                Quay lại
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={() => setActiveTab("wiring")}
              >
                Tính dây và MCCB
              </button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="wiring">
          <WiringCalculator inverterCombination={inverterCombination} />
          
          <div className="mt-4 text-left">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              onClick={() => setActiveTab("output")}
            >
              Quay lại kết quả
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SolarCalculator;
