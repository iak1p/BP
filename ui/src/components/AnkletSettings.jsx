import SettingsInput from "./SettingsInput";

export default function AnkletSettings({
  setDepth,
  setLineLength,
  setSquareSide,
  usecase,
}) {
  return (
    <>
      <div className="canvas-settings">
        <SettingsInput
          label="Depth:"
          type="number"
          defaultValue={4}
          id="depth"
          onChange={(e) => setDepth(Number(e.target.value))}
        />

        <SettingsInput
          label="Line size:"
          type="number"
          defaultValue={usecase?.lineLength}
          id="line-size"
          onChange={(e) => setLineLength(Number(e.target.value))}
        />

        <SettingsInput
          label="Square size:"
          type="number"
          defaultValue={usecase?.squareSide}
          id="square-size"
          onChange={(e) => setSquareSide(Number(e.target.value))}
        />
      </div>
    </>
  );
}
