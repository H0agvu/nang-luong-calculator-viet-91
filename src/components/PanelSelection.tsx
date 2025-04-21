import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SolarPanel } from "@/interfaces/solarPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { solarPanels } from "@/data/solarPanels";
import { Laptop } from "lucide-react";

interface PanelSelectionProps {
  onPanelChange: (panel: SolarPanel) => void;
  onTotalPanelsChange: (count: number) => void;
  onStringsChange: (count: number) => void;
  onPanelsPerStringChange: (count: number) => void;
  selectedPanel: SolarPanel | null;
  totalPanels: number;
  strings: number;
  panelsPerString: number;
}

const PanelSelection = ({
  onPanelChange,
  onTotalPanelsChange,
  onStringsChange,
  onPanelsPerStringChange,
  selectedPanel,
  totalPanels,
  strings,
  panelsPerString,
}: PanelSelectionProps) => {
  const [panel, setPanel] = useState<SolarPanel | null>(selectedPanel);
  const [count, setCount] = useState<number>(totalPanels);
  const [stringCount, setStringCount] = useState<number>(strings);
  const [panelStringCount, setPanelStringCount] = useState<number>(panelsPerString);

  useEffect(() => {
    onPanelChange(panel as SolarPanel);
  }, [panel, onPanelChange]);

  useEffect(() => {
    onTotalPanelsChange(count);
  }, [count, onTotalPanelsChange]);

  useEffect(() => {
    onStringsChange(stringCount);
  }, [stringCount, onStringsChange]);

  useEffect(() => {
    onPanelsPerStringChange(panelStringCount);
  }, [panelStringCount, onPanelsPerStringChange]);

  const handlePanelChange = (value: SolarPanel) => {
    setPanel(value);
  };

  const handleTotalPanelsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCount(value);
  };

  const handleStringsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setStringCount(value);
  };

  const handlePanelsPerStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPanelStringCount(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Thông số tấm pin
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2">
            <Label htmlFor="panel-type">Chọn tấm pin</Label>
          </div>
          <RadioGroup
            defaultValue={panel?.id}
            className="grid grid-cols-2 gap-2"
            onValueChange={(value) => {
              const selected = solarPanels.find((p) => p.id === value);
              if (selected) {
                handlePanelChange(selected);
              }
            }}
          >
            {solarPanels.map((panel) => (
              <div key={panel.id} className="space-y-1">
                <RadioGroupItem value={panel.id} id={panel.id} className="aspect-square h-4 w-4" />
                <Label htmlFor={panel.id} className="cursor-pointer flex items-center gap-2">
                  <Laptop className="w-4 h-4" />
                  {panel.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="total-panels">Tổng số tấm pin</Label>
            <Input
              type="number"
              id="total-panels"
              min="0"
              value={count}
              onChange={handleTotalPanelsChange}
            />
          </div>

          <div>
            <Label htmlFor="strings">Số lượng string</Label>
            <Input
              type="number"
              id="strings"
              min="0"
              value={stringCount}
              onChange={handleStringsChange}
            />
          </div>

          <div>
            <Label htmlFor="panels-per-string">Số tấm pin trên mỗi string</Label>
            <Input
              type="number"
              id="panels-per-string"
              min="0"
              value={panelStringCount}
              onChange={handlePanelsPerStringChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PanelSelection;
