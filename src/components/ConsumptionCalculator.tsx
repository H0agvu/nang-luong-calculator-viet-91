
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ConsumptionCalculator = () => {
  const [monthlyBill, setMonthlyBill] = useState<string>("");
  const [result, setResult] = useState<{
    monthlyConsumption: number;
    requiredCapacity: number;
  } | null>(null);

  const calculateCapacity = () => {
    // Giả định giá điện trung bình là 3000 VND/kWh
    const avgElectricityPrice = 3000;
    // Tính toán số kWh tiêu thụ hàng tháng
    const monthlyConsumption = Number(monthlyBill) / avgElectricityPrice;
    
    // Tính toán công suất hệ thống điện mặt trời cần thiết
    // Giả định:
    // - 1 kWp sản xuất trung bình 4 kWh/ngày (tùy theo vùng miền)
    // - Hệ số hiệu suất 0.85
    const dailyConsumption = monthlyConsumption / 30;
    const requiredCapacity = dailyConsumption / (4 * 0.85);

    setResult({
      monthlyConsumption: Math.round(monthlyConsumption * 100) / 100,
      requiredCapacity: Math.round(requiredCapacity * 100) / 100,
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
                type="number"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value)}
                placeholder="Nhập số tiền điện hàng tháng"
              />
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
                <div>
                  <p className="text-sm text-gray-600">Lượng điện tiêu thụ hàng tháng:</p>
                  <p className="text-lg font-semibold">{result.monthlyConsumption} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Công suất hệ thống điện mặt trời cần lắp đặt:</p>
                  <p className="text-lg font-semibold">{result.requiredCapacity} kWp</p>
                </div>
                <div className="text-sm text-gray-500 mt-4">
                  <p>* Kết quả tính toán là ước tính dựa trên:</p>
                  <ul className="list-disc list-inside">
                    <li>Giá điện trung bình: 3,000 VND/kWh</li>
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
