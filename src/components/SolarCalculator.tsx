
import { useState, useEffect } from "react";
import { SolarPanel, inverters as defaultInverters } from "@/data/solarData";
import PanelSelection from "./PanelSelection";
import InverterSelection from "./InverterSelection";
import WiringCalculator from "./WiringCalculator";
import InverterDataInput from "./InverterDataInput";
import InverterList from "./InverterList";
import {
  calculateTotalPower,
  calculateInverterPower,
  findOptimalInverterCombination,
  calculateDCACRatio,
  InverterCombination
} from "@/utils/solarCalculations";

const MENU_LIST = [
  { key: "input", label: "Nhập liệu" },
  { key: "output", label: "Kết quả Inverter" },
  { key: "wiring", label: "Tính dây và MCCB" },
  { key: "inverter-list", label: "Danh sách inverter" },
];

const SolarCalculator = () => {
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);
  const [totalPanels, setTotalPanels] = useState<number>(0);
  const [strings, setStrings] = useState<number>(0);
  const [panelsPerString, setPanelsPerString] = useState<number>(0);

  const [totalPower, setTotalPower] = useState<number>(0);
  const [inverterPower, setInverterPower] = useState<number>(0);
  const [inverterCombination, setInverterCombination] = useState<InverterCombination | null>(null);
  const [dcAcRatio, setDcAcRatio] = useState<number>(0);

  const [activeMenu, setActiveMenu] = useState<string>("input");
  const [customInverters, setCustomInverters] = useState(defaultInverters);

  useEffect(() => {
    if (selectedPanel && totalPanels > 0) {
      const power = calculateTotalPower(selectedPanel.power, totalPanels);
      setTotalPower(power);

      const invPower = calculateInverterPower(power);
      setInverterPower(invPower);

      const combination = findOptimalInverterCombination(invPower / 1000, customInverters);
      setInverterCombination(combination);

      if (combination.totalPower > 0) {
        const ratio = calculateDCACRatio(power, combination.totalPower * 1000);
        setDcAcRatio(ratio);
      }
    } else {
      setTotalPower(0);
      setInverterPower(0);
      setInverterCombination(null);
      setDcAcRatio(0);
    }
  }, [selectedPanel, totalPanels, customInverters]);

  // Disable "output" unless đã nhập liệu xong, "wiring" trừ khi có inverterCombination
  const isInputCompleted = !!selectedPanel && totalPanels > 0;
  const isOutputAvailable = isInputCompleted;
  const isWiringAvailable = inverterCombination !== null && inverterCombination.totalPower > 0;

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Công cụ tính toán hệ thống điện năng lượng mặt trời
        </h1>
        <p className="text-gray-600 mt-2">
          Tính toán thiết bị điện của hệ thống pin mặt trời
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar menu */}
        <ul className="flex md:flex-col gap-2 md:w-64 w-full justify-between">
          {MENU_LIST.map(item => {
            let disabled = false;
            if (item.key === "output") disabled = !isOutputAvailable;
            if (item.key === "wiring") disabled = !isWiringAvailable;

            return (
              <li key={item.key}>
                <button
                  className={[
                    "w-full px-4 py-2 rounded text-left font-medium transition",
                    activeMenu === item.key
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                    disabled ? "opacity-50 pointer-events-none" : ""
                  ].join(" ")}
                  onClick={() => setActiveMenu(item.key)}
                  disabled={disabled}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Content section */}
        <div className="flex-1 bg-white rounded shadow py-6 px-3 md:px-6 min-h-[375px]">
          {activeMenu === "input" && (
            <div>
              <PanelSelection
                onPanelChange={setSelectedPanel}
                onTotalPanelsChange={setTotalPanels}
                onStringsChange={setStrings}
                onPanelsPerStringChange={setPanelsPerString}
              />
              {/* Nút sang output nếu nhập đủ */}
              {isInputCompleted && (
                <div className="mt-4 text-right">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={() => setActiveMenu("output")}
                    type="button"
                  >
                    Xem kết quả
                  </button>
                </div>
              )}
            </div>
          )}

          {activeMenu === "output" && (
            <div>
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
                    onClick={() => setActiveMenu("input")}
                    type="button"
                  >
                    Quay lại
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={() => setActiveMenu("wiring")}
                    type="button"
                  >
                    Tính dây và MCCB
                  </button>
                </div>
              )}
            </div>
          )}

          {activeMenu === "wiring" && (
            <div>
              <WiringCalculator inverterCombination={inverterCombination} />
              <div className="mt-4 text-left">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => setActiveMenu("output")}
                  type="button"
                >
                  Quay lại kết quả
                </button>
              </div>
            </div>
          )}

          {activeMenu === "inverter-list" && (
            <div>
              <InverterDataInput value={customInverters} onChange={setCustomInverters} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarCalculator;
