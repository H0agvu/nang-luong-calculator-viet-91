
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

  // New: fake panel data state for runtime added panels
  const [panels, setPanels] = useState<SolarPanel[]>(solarPanels);
  const [showPanelForm, setShowPanelForm] = useState(false);
  const [newPanel, setNewPanel] = useState<{ name: string; width: number; length: number; efficiency: number; power: number }>({
    name: "",
    width: 0,
    length: 0,
    efficiency: 1,
    power: 0,
  });

  useEffect(() => {
    const selectedPanel = panels.find(panel => panel.id === selectedPanelId) || null;
    onPanelChange(selectedPanel);
  }, [selectedPanelId, onPanelChange, panels]);

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

  // New: handle add custom panel
  const handleAddPanel = () => {
    if (
      !newPanel.name ||
      newPanel.width <= 0 ||
      newPanel.length <= 0 ||
      newPanel.efficiency <= 0 ||
      newPanel.power <= 0
    ) return;
    const id = `${newPanel.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
    setPanels((prev) => [...prev, { id, ...newPanel }]);
    setSelectedPanelId(id);
    setShowPanelForm(false);
    setNewPanel({
      name: "",
      width: 0,
      length: 0,
      efficiency: 1,
      power: 0,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Thông số đầu vào</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="panel-select">
            Loại tấm pin năng lượng mặt trời
          </Label>
          <div className="flex gap-2 items-center">
            <Select
              value={selectedPanelId}
              onValueChange={(value) => setSelectedPanelId(value)}
            >
              <SelectTrigger id="panel-select">
                <SelectValue placeholder="Chọn loại tấm pin" />
              </SelectTrigger>
              <SelectContent>
                {panels.map((panel) => (
                  <SelectItem key={panel.id} value={panel.id}>
                    {panel.name} ({panel.power}W)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              className="rounded bg-green-500 px-2 py-1 text-white text-xs hover:bg-green-600"
              type="button"
              onClick={() => setShowPanelForm((v) => !v)}
            >
              + Thêm
            </button>
          </div>
          {showPanelForm && (
            <div className="p-3 mt-2 border rounded bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Tên tấm pin"
                  value={newPanel.name}
                  onChange={e => setNewPanel({ ...newPanel, name: e.target.value })}
                  className="col-span-2"
                />
                <Input
                  type="number"
                  placeholder="Chiều rộng (mm)"
                  value={newPanel.width || ""}
                  onChange={e => setNewPanel({ ...newPanel, width: parseInt(e.target.value) || 0 })}
                />
                <Input
                  type="number"
                  placeholder="Chiều dài (mm)"
                  value={newPanel.length || ""}
                  onChange={e => setNewPanel({ ...newPanel, length: parseInt(e.target.value) || 0 })}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  max="1"
                  placeholder="Hiệu suất (0.01-1)"
                  value={newPanel.efficiency || ""}
                  onChange={e => setNewPanel({ ...newPanel, efficiency: parseFloat(e.target.value) || 0 })}
                />
                <Input
                  type="number"
                  placeholder="Công suất (W)"
                  value={newPanel.power || ""}
                  onChange={e => setNewPanel({ ...newPanel, power: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex mt-2 gap-2">
                <button
                  className="rounded bg-blue-500 px-3 py-1 text-white text-xs hover:bg-blue-600"
                  type="button"
                  onClick={handleAddPanel}
                >
                  Lưu
                </button>
                <button
                  className="rounded bg-gray-200 px-3 py-1 text-xs"
                  type="button"
                  onClick={() => setShowPanelForm(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="total-panels">Tổng số lượng tấm pin</Label>
          <Input
            id="total-panels"
            type="number"
            min="0"
            value={totalPanels || ""}
            onChange={(e) =>
              handleTotalPanelsChange(parseInt(e.target.value) || 0)
            }
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
            onChange={(e) =>
              handleStringsChange(parseInt(e.target.value) || 0)
            }
            placeholder="Nhập số lượng string"
          />
        </div>

        {strings > 0 && (
          <div className="pt-2">
            <div className="text-sm font-medium">
              Số lượng tấm pin mỗi string
            </div>
            <div className="text-2xl font-bold">{panelsPerString}</div>
          </div>
        )}

        {selectedPanelId && (
          <div className="pt-2 grid grid-cols-2 gap-4">
            {panels.find((p) => p.id === selectedPanelId) && (
              <>
                <div>
                  <div className="text-sm font-medium">Kích thước</div>
                  <div className="text-base">
                    {panels.find((p) => p.id === selectedPanelId)?.width} x{" "}
                    {panels.find((p) => p.id === selectedPanelId)?.length} mm
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Hiệu suất</div>
                  <div className="text-base">
                    {panels.find((p) => p.id === selectedPanelId)?.efficiency *
                      100}
                    %
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
