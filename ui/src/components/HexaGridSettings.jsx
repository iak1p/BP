import SettingsInput from "./SettingsInput";

export default function HexaGridSettings({
  setSideLength,
  setRows,
  setCols,
  usecase,
}) {
  return (
    <>
      <div className="canvas-settings">
        <SettingsInput
          label="Side Length:"
          type="number"
          defaultValue={usecase?.sideLength}
          id="side-length"
          step={10}
          onChange={(e) => setSideLength(Number(e.target.value))}
        />

        <SettingsInput
          label="Rows:"
          type="number"
          defaultValue={usecase?.rows}
          id="rows"
          onChange={(e) => setRows(Number(e.target.value))}
        />

        <SettingsInput
          label="Cols:"
          type="number"
          defaultValue={usecase?.cols}
          id="cols"
          onChange={(e) => setCols(Number(e.target.value))}
        />
      </div>
    </>
  );
}
