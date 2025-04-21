
import { useState, useEffect } from "react";
import { SolarPanel, solarPanels } from "@/data/solarData";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PanelSelectionProps {
  onPanelChange: (panel: SolarPanel | null) => void;
  onTotalPanelsChange: (total: number) => void;
  onStringsChange: (strings: number) => void;
  onPanelsPerStringChange: (panels: number) => void;
}

const PanelSelection = ({
  onPanelChange,
  onTotalPanelsChange,
  onStringsChange,
  onPanelsPerStringChange
}: PanelSelectionProps) => {
  const [selectedPanelId, setSelectedPanelId] = useState<string>("");
  const [totalPanels, setTotalPanels] = useState<number>(0);
  const [strings, setStrings] = useState<number>(0);
  const [panelsPerString, setPanelsPerString] = useState<number>(0);

  useEffect(() => {
    const selectedPanel = solarPanels.find(panel => panel.id === selectedPanelId) || null;
    onPanelChange(selectedPanel);
  }, [selectedPanelId, onPanelChange]);

  useEffect(() => {
    // Update panels per string based on total panels and strings
    if (strings > 0) {
      const calculatedPanelsPerString = Math.floor(totalPanels / strings);
      setPanelsPerString(calculatedPanelsPerString);
      onPanelsPerStringChange(calculatedPanelsPerString);
    }
  }, [totalPanels, strings, onPanelsPerStringChange]);

  const handleTotalPanelsChange = (value: number) => {
    setTotalPanels(value);
    onTotalPanelsChange(value);
  };

  const handleStringsChange = (value: number) => {
    setStrings(value);
    onStringsChange(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Thông số đầu vào</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="panel-select">Loại tấm pin năng lượng mặt trời</Label>
          <Select 
            value={selectedPanelId} 
            onValueChange={(value) => setSelectedPanelId(value)}
          >
            <SelectTrigger id="panel-select">
              <SelectValue placeholder="Chọn loại tấm pin" />
            </SelectTrigger>
            <SelectContent>
              {solarPanels.map((panel) => (
                <SelectItem key={panel.id} value={panel.id}>
                  {panel.name} ({panel.power}W)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total-panels">Tổng số lượng tấm pin</Label>
          <Input
            id="total-panels"
            type="number"
            min="0"
            value={totalPanels || ""}
            onChange={(e) => handleTotalPanelsChange(parseInt(e.target.value) || 0)}
            placeholder="Nhập tổng số tấm pin"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="strings">Tổng số lượng string yêu cầu</Label>
          <Input
            id="strings"
            type="number"
            min="0"
            value={strings || ""}
            onChange={(e) => handleStringsChange(parseInt(e.target.value) || 0)}
            placeholder="Nhập số lượng string"
          />
        </div>

        {strings > 0 && (
          <div className="pt-2">
            <div className="text-sm font-medium">Số lượng tấm pin mỗi string</div>
            <div className="text-2xl font-bold">{panelsPerString}</div>
          </div>
        )}

        {selectedPanelId && (
          <div className="pt-2 grid grid-cols-2 gap-4">
            {solarPanels.find(p => p.id === selectedPanelId) && (
              <>
                <div>
                  <div className="text-sm font-medium">Kích thước</div>
                  <div className="text-base">
                    {solarPanels.find(p => p.id === selectedPanelId)?.width} x {solarPanels.find(p => p.id === selectedPanelId)?.length} mm
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Hiệu suất</div>
                  <div className="text-base">
                    {solarPanels.find(p => p.id === selectedPanelId)?.efficiency * 100}%
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PanelSelection;
