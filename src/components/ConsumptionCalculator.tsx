
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { calculateElectricityConsumption } from "@/utils/electricityCalculations";
import { Checkbox } from "@/components/ui/checkbox";

const ConsumptionCalculator = () => {
  const [monthlyBill, setMonthlyBill] = useState<string>("");
  const [hasVAT, setHasVAT] = useState<boolean>(false);
  const [result, setResult] = useState<{
    totalKwh: number;
    breakdownByLevel: { kwh: number; cost: number }[];
    requiredCapacity: number;
  } | null>(null);

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setMonthlyBill("");
      return;
    }
    const number = parseInt(value);
    setMonthlyBill(number.toLocaleString("vi-VN"));
  };

  const calculateCapacity = () => {
    const billValue = Number(monthlyBill.replace(/\./g, ""));
    const { totalKwh, breakdownByLevel } = calculateElectricityConsumption(billValue, hasVAT);
    
    // Tính toán công suất hệ thống điện mặt trời cần thiết
    const dailyConsumption = totalKwh / 30;
    const requiredCapacity = dailyConsumption / (4 * 0.85);

    setResult({
      totalKwh,
      breakdownByLevel,
      requiredCapacity: Math.round(requiredCapacity * 100) / 100
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Tính toán công suất điện mặt trời từ hóa đơn điện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="monthlyBill">Số tiền điện hàng tháng (VND)</Label>
              <Input
                id="monthlyBill"
                value={monthlyBill}
                onChange={handleBillChange}
                placeholder="Nhập số tiền điện hàng tháng"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasVAT" 
                checked={hasVAT}
                onCheckedChange={(checked) => setHasVAT(checked as boolean)}
              />
              <Label htmlFor="hasVAT">Đã bao gồm VAT (10%)</Label>
            </div>

            <Button 
              onClick={calculateCapacity}
              disabled={!monthlyBill}
              className="w-full bg-primary"
            >
              Tính toán
            </Button>

            {result && (
              <div className="mt-6 space-y-4 p-4 bg-blue-50 rounded-lg">
                <div className="space-y-4">
                  <p className="font-medium">Chi tiết tính toán theo bậc thang:</p>
                  {result.breakdownByLevel.map((level, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                      <div>Bậc {index + 1}: {level.kwh.toFixed(1)} kWh</div>
                      <div className="text-right">{level.cost.toLocaleString("vi-VN")} VND</div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng lượng điện tiêu thụ:</p>
                  <p className="text-lg font-semibold">{result.totalKwh.toLocaleString("vi-VN")} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Công suất hệ thống điện mặt trời cần lắp đặt:</p>
                  <p className="text-lg font-semibold">{result.requiredCapacity.toLocaleString("vi-VN")} kWp</p>
                </div>
                <div className="text-sm text-gray-500 mt-4">
                  <p>* Kết quả tính toán là ước tính dựa trên:</p>
                  <ul className="list-disc list-inside">
                    <li>Giá điện theo bậc thang EVN từ 11/10/2024</li>
                    <li>Sản lượng trung bình: 4 kWh/kWp/ngày</li>
                    <li>Hệ số hiệu suất: 85%</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumptionCalculator;
