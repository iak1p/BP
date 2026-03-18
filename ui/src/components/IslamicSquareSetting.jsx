import SettingsInput from "./SettingsInput";

export default function IslamicSquareSetting({
  setSize,
  setRows,
  setCols,
  usecase,
}) {
  return (
    <>
      <div className="canvas-settings">
        <SettingsInput
          label="Size:"
          type="number"
          defaultValue={usecase?.size}
          id="size"
          onChange={(e) => setSize(Number(e.target.value))}
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
