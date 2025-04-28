
import { useState, useEffect } from "react";
import { InverterCombination } from "@/utils/solarCalculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  calculateCurrent, findSuitableMCCB, findSuitableCable
} from "@/utils/solarCalculations";

interface WiringCalculatorProps {
  inverterCombination: InverterCombination | null;
  onWireSave?: (inverterWireSummary: string, mainWireSummary: string) => void;
}

const WiringCalculator = ({ inverterCombination, onWireSave }: WiringCalculatorProps) => {
  const [singlePhaseType, setSinglePhaseType] = useState<"1P" | "3P">("3P");
  const [singleCoreType, setSingleCoreType] = useState<"single" | "multi">("multi");
  const [singleInsulationType, setSingleInsulationType] = useState<"PVC" | "XLPE">("XLPE");
  const [singleInstallationType, setSingleInstallationType] = useState<"underground" | "air">("air");
  const [totalPhaseType, setTotalPhaseType] = useState<"1P" | "3P">("3P");
  const [totalCoreType, setTotalCoreType] = useState<"single" | "multi">("multi");
  const [totalInsulationType, setTotalInsulationType] = useState<"PVC" | "XLPE">("XLPE");
  const [totalInstallationType, setTotalInstallationType] = useState<"underground" | "air">("air");
  const [activeTab, setActiveTab] = useState<string>("settings");

  const [inverterWiring, setInverterWiring] = useState<any[]>([]);
  const [totalWiring, setTotalWiring] = useState<any | null>(null);
  const [hasHighCurrent, setHasHighCurrent] = useState(false);

  useEffect(() => {
    if (!inverterCombination) return;

    let detectedHighCurrent = false;

    const wiringResults = inverterCombination.inverters.map(item => {
      const { inverter, count } = item;
      const voltage = singlePhaseType === "1P" ? 220 : 380;
      const current = calculateCurrent(inverter.power, voltage, singlePhaseType, inverter.efficiency);
      const mccbRating = findSuitableMCCB(current * 1.25);
      const cable = findSuitableCable(
        current,
        singlePhaseType,
        singleCoreType,
        singleInsulationType,
        singleInstallationType
      );

      if (cable.count > 1) {
        detectedHighCurrent = true;
      }

      return {
        inverter,
        count,
        phaseType: singlePhaseType,
        voltage,
        current: current.toFixed(2),
        mccbRating,
        cable
      };
    });

    setInverterWiring(wiringResults);

    if (wiringResults.length > 0) {
      const totalPower = inverterCombination.totalPower;
      const voltage = totalPhaseType === "1P" ? 220 : 380;
      const current = calculateCurrent(totalPower, voltage, totalPhaseType, 99);
      const mccbRating = findSuitableMCCB(current * 1.25);
      const cable = findSuitableCable(
        current,
        totalPhaseType,
        totalCoreType,
        totalInsulationType,
        totalInstallationType
      );

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
    
    if (onWireSave && wiringResults.length > 0 && totalWiring) {
      const inverterWireSummary = wiringResults.map(item => 
        `${item.inverter.name}: MCCB ${item.mccbRating}A, ${item.cable.type}${item.cable.count > 1 ? ` (${item.cable.count}x)` : ''}`
      ).join('; ');
      
      const mainWireSummary = totalWiring ? 
        `MCCB ${totalWiring.mccbRating}A, ${totalWiring.cable.type}${totalWiring.cable.count > 1 ? ` (${totalWiring.cable.count}x)` : ''}` : '';
      
      onWireSave(inverterWireSummary, mainWireSummary);
    }
  }, [
    inverterCombination,
    singlePhaseType,
    singleCoreType,
    singleInsulationType,
    singleInstallationType,
    totalPhaseType,
    totalCoreType,
    totalInsulationType,
    totalInstallationType
  ]);

  if (!inverterCombination) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Tính toán dây và MCCB</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-medium"
            >
              Thiết lập
            </TabsTrigger>
            <TabsTrigger 
              value="results"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 font-medium"
            >
              Kết quả
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-8 pt-4">
            <div className="border rounded-lg p-4 bg-blue-50/50">
              <div className="font-semibold mb-4 text-blue-700">
                Thiết lập dây/mccb cho <span className="underline">inverter đơn lẻ</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="font-medium">Loại pha</div>
                  <RadioGroup
                    value={singlePhaseType}
                    onValueChange={(value) => setSinglePhaseType(value as "1P" | "3P")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1P" id="single-phase-1p" />
                      <Label htmlFor="single-phase-1p">1 Pha (220V)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3P" id="single-phase-3p" />
                      <Label htmlFor="single-phase-3p">3 Pha (380V)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Loại lõi dây</div>
                  <RadioGroup
                    value={singleCoreType}
                    onValueChange={(value) => setSingleCoreType(value as "single" | "multi")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single-core-single" />
                      <Label htmlFor="single-core-single">Lõi đơn</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multi" id="single-core-multi" />
                      <Label htmlFor="single-core-multi">Lõi nhiều sợi</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Loại vỏ dây</div>
                  <RadioGroup
                    value={singleInsulationType}
                    onValueChange={(value) => setSingleInsulationType(value as "PVC" | "XLPE")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PVC" id="single-insulation-pvc" />
                      <Label htmlFor="single-insulation-pvc">Vỏ PVC</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="XLPE" id="single-insulation-xlpe" />
                      <Label htmlFor="single-insulation-xlpe">Vỏ XLPE</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Phương pháp lắp đặt</div>
                  <RadioGroup
                    value={singleInstallationType}
                    onValueChange={(value) => setSingleInstallationType(value as "underground" | "air")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="underground" id="single-install-underground" />
                      <Label htmlFor="single-install-underground">Đi ngầm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="air" id="single-install-air" />
                      <Label htmlFor="single-install-air">Đi trong không khí</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-green-50/50">
              <div className="font-semibold mb-4 text-green-700">
                Thiết lập dây/mccb cho <span className="underline">tủ tổng</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="font-medium">Loại pha</div>
                  <RadioGroup
                    value={totalPhaseType}
                    onValueChange={(value) => setTotalPhaseType(value as "1P" | "3P")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1P" id="total-phase-1p" />
                      <Label htmlFor="total-phase-1p">1 Pha (220V)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3P" id="total-phase-3p" />
                      <Label htmlFor="total-phase-3p">3 Pha (380V)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Loại lõi dây</div>
                  <RadioGroup
                    value={totalCoreType}
                    onValueChange={(value) => setTotalCoreType(value as "single" | "multi")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="total-core-single" />
                      <Label htmlFor="total-core-single">Lõi đơn</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multi" id="total-core-multi" />
                      <Label htmlFor="total-core-multi">Lõi nhiều sợi</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Loại vỏ dây</div>
                  <RadioGroup
                    value={totalInsulationType}
                    onValueChange={(value) => setTotalInsulationType(value as "PVC" | "XLPE")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PVC" id="total-insulation-pvc" />
                      <Label htmlFor="total-insulation-pvc">Vỏ PVC</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="XLPE" id="total-insulation-xlpe" />
                      <Label htmlFor="total-insulation-xlpe">Vỏ XLPE</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Phương pháp lắp đặt</div>
                  <RadioGroup
                    value={totalInstallationType}
                    onValueChange={(value) => setTotalInstallationType(value as "underground" | "air")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="underground" id="total-install-underground" />
                      <Label htmlFor="total-install-underground">Đi ngầm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="air" id="total-install-air" />
                      <Label htmlFor="total-install-air">Đi trong không khí</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setActiveTab("results")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Xem kết quả <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="pt-4">
            {hasHighCurrent && (
              <Alert
                variant="destructive"
                className="mb-4 border-[#FEC6A1] bg-[#FEF7CD]"
              >
                <AlertCircle className="h-4 w-4 text-[#F97316]" />
                <AlertDescription className="text-[#F97316] font-medium">
                  Một số dòng điện vượt quá khả năng của cáp đơn. Hệ thống đã tự động tính toán số lượng cáp song song cần thiết.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
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
                        <div className="mt-1 text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded font-medium">
                          (Sử dụng {item.cable.count} cáp song song do dòng điện lớn)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                          <div className="mt-1 text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded font-medium">
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
