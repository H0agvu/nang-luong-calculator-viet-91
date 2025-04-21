
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
import { Settings, Calculator, List, SlidersHorizontal } from "lucide-react";

const MENU_LIST = [
  { key: "input", label: "Nhập liệu", icon: Calculator },
  { key: "output", label: "Kết quả Inverter", icon: SlidersHorizontal },
  { key: "wiring", label: "Tính dây và MCCB", icon: Settings },
  { key: "inverter-list", label: "Danh sách inverter", icon: List },
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

  // Tính toán lại dữ liệu khi thay đổi panel hoặc số lượng tấm (nhưng KHÔNG reset khi chuyển tab)
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

  // Chặn chuyển sang các tab chưa đủ điều kiện
  const isInputCompleted = !!selectedPanel && totalPanels > 0;
  const isOutputAvailable = isInputCompleted;
  const isWiringAvailable = inverterCombination !== null && inverterCombination.totalPower > 0;

  // ----------- SIDEBAR UI UPGRADE -----------
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
        {/* Sidebar menu đẹp hơn, spacing chặt chẽ hơn, active rõ hơn */}
        <nav aria-label="Main" className="md:w-56 w-full">
          <ul className="flex flex-col gap-0">
            {MENU_LIST.map((item, idx) => {
              let disabled = false;
              if (item.key === "output") disabled = !isOutputAvailable;
              if (item.key === "wiring") disabled = !isWiringAvailable;

              const isActive = activeMenu === item.key;

              return (
                <li key={item.key} className={idx !== MENU_LIST.length - 1 ? "mb-[1px]" : ""}>
                  <button
                    className={[
                      "w-full flex items-center px-3 py-2 rounded-md font-medium transition-all duration-150 select-none",
                      isActive
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "bg-transparent text-gray-700 hover:bg-primary/5 hover:text-primary",
                      disabled
                        ? "opacity-40 pointer-events-none"
                        : "cursor-pointer hover:scale-[1.03]",
                    ].join(" ")}
                    style={{ minHeight: 42 }}
                    onClick={() => setActiveMenu(item.key)}
                    disabled={disabled}
                    type="button"
                  >
                    <item.icon
                      size={20}
                      className={[
                        "mr-2 transition-colors duration-150",
                        isActive
                          ? "text-primary"
                          : "text-gray-400 group-hover:text-primary"
                      ].join(" ")}
                    />
                    <span
                      className={isActive ? "font-bold" : ""}
                      style={{
                        letterSpacing: ".01em"
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content section */}
        <div className="flex-1 bg-white rounded shadow py-6 px-3 md:px-6 min-h-[375px]">
          {activeMenu === "input" && (
            <div>
              <PanelSelection
                onPanelChange={setSelectedPanel}
                onTotalPanelsChange={setTotalPanels}
                onStringsChange={setStrings}
                onPanelsPerStringChange={setPanelsPerString}
                // Đảm bảo truyền đủ props, giữ lại state đã chọn
              />
              {/* Nút sang output nếu nhập đủ */}
              {isInputCompleted && (
                <div className="mt-4 text-right">
                  <button
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
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
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
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
