
import { useState, useEffect } from "react";
import { InverterCombination } from "@/utils/solarCalculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  calculateCurrent, findSuitableMCCB, findSuitableCable
} from "@/utils/solarCalculations";

interface WiringCalculatorProps {
  inverterCombination: InverterCombination | null;
}

const WiringCalculator = ({ inverterCombination }: WiringCalculatorProps) => {
  const [phaseType, setPhaseType] = useState<"1P" | "3P">("3P");
  const [coreType, setCoreType] = useState<"single" | "multi">("multi");
  const [insulationType, setInsulationType] = useState<"PVC" | "XLPE">("XLPE");
  const [installationType, setInstallationType] = useState<"underground" | "air">("air");

  const [inverterWiring, setInverterWiring] = useState<any[]>([]);
  const [totalWiring, setTotalWiring] = useState<any | null>(null);
  const [hasHighCurrent, setHasHighCurrent] = useState(false);

  useEffect(() => {
    if (!inverterCombination) return;

    let detectedHighCurrent = false;

    // Tính toán cho từng loại inverter
    const wiringResults = inverterCombination.inverters.map(item => {
      const { inverter, count } = item;
      const voltage = phaseType === "1P" ? 220 : 380;
      const current = calculateCurrent(inverter.power, voltage, phaseType, inverter.efficiency);
      const mccbRating = findSuitableMCCB(current);
      const cable = findSuitableCable(current, phaseType, coreType, insulationType, installationType);
      
      if (cable.count > 1) {
        detectedHighCurrent = true;
      }

      return {
        inverter,
        count,
        phaseType,
        voltage,
        current: current.toFixed(2),
        mccbRating,
        cable
      };
    });

    setInverterWiring(wiringResults);

    // Tính toán cho tủ tổng
    if (wiringResults.length > 0) {
      // Tính tổng công suất từ tất cả inverter
      const totalPower = inverterCombination.totalPower;
      const voltage = phaseType === "1P" ? 220 : 380;
      const current = calculateCurrent(totalPower, voltage, phaseType, 99); // Giả định hiệu suất 99%
      const mccbRating = findSuitableMCCB(current);
      const cable = findSuitableCable(current, phaseType, coreType, insulationType, installationType);
      
      if (cable.count > 1) {
        detectedHighCurrent = true;
      }

      setTotalWiring({
        power: totalPower,
        voltage,
        current: current.toFixed(2),
        mccbRating,
        cable
      });
    }
    
    setHasHighCurrent(detectedHighCurrent);
  }, [inverterCombination, phaseType, coreType, insulationType, installationType]);

  if (!inverterCombination) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Tính toán dây và MCCB</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="settings">Thiết lập</TabsTrigger>
            <TabsTrigger value="results">Kết quả</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="font-medium">Loại pha</div>
              <RadioGroup 
                value={phaseType} 
                onValueChange={(value) => setPhaseType(value as "1P" | "3P")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1P" id="phase-1p" />
                  <Label htmlFor="phase-1p">1 Pha (220V)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3P" id="phase-3p" />
                  <Label htmlFor="phase-3p">3 Pha (380V)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Loại lõi dây</div>
              <RadioGroup 
                value={coreType} 
                onValueChange={(value) => setCoreType(value as "single" | "multi")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="core-single" />
                  <Label htmlFor="core-single">Lõi đơn</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multi" id="core-multi" />
                  <Label htmlFor="core-multi">Lõi nhiều sợi</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Loại vỏ dây</div>
              <RadioGroup 
                value={insulationType} 
                onValueChange={(value) => setInsulationType(value as "PVC" | "XLPE")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PVC" id="insulation-pvc" />
                  <Label htmlFor="insulation-pvc">Vỏ PVC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="XLPE" id="insulation-xlpe" />
                  <Label htmlFor="insulation-xlpe">Vỏ XLPE</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Phương pháp lắp đặt</div>
              <RadioGroup 
                value={installationType} 
                onValueChange={(value) => setInstallationType(value as "underground" | "air")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="underground" id="installation-underground" />
                  <Label htmlFor="installation-underground">Đi ngầm</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="air" id="installation-air" />
                  <Label htmlFor="installation-air">Đi trong không khí</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="pt-4">
            {hasHighCurrent && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Một số dòng điện vượt quá khả năng của cáp đơn. Hệ thống đã tự động tính toán số lượng cáp song song cần thiết.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Thông số Inverter đơn lẻ</h3>
                <div className="space-y-4">
                  {inverterWiring.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <div className="font-medium text-lg mb-2">
                        {item.inverter.name} ({item.count} cái)
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Công suất:</span> {item.inverter.power} kW
                        </div>
                        <div>
                          <span className="text-gray-600">Loại pha:</span> {item.phaseType === "1P" ? "1 Pha (220V)" : "3 Pha (380V)"}
                        </div>
                        <div>
                          <span className="text-gray-600">Dòng điện:</span> {item.current} A
                        </div>
                        <div>
                          <span className="text-gray-600">MCCB:</span> {item.mccbRating} A
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Dây cáp:</span> {item.cable.type}
                          {item.cable.count > 1 && (
                            <div className="mt-1 text-xs text-amber-600">
                              (Sử dụng {item.cable.count} cáp song song do dòng điện lớn)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {totalWiring && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Thông số tủ tổng</h3>
                  <div className="border p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-600">Tổng công suất:</span> {totalWiring.power} kW
                      </div>
                      <div>
                        <span className="text-gray-600">Điện áp:</span> {totalWiring.voltage} V
                      </div>
                      <div>
                        <span className="text-gray-600">Dòng điện:</span> {totalWiring.current} A
                      </div>
                      <div>
                        <span className="text-gray-600">MCCB:</span> {totalWiring.mccbRating} A
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Dây cáp:</span> {totalWiring.cable.type}
                        {totalWiring.cable.count > 1 && (
                          <div className="mt-1 text-xs text-amber-600">
                            (Sử dụng {totalWiring.cable.count} cáp song song do dòng điện lớn)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WiringCalculator;

