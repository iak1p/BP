import SettingsInput from "./SettingsInput";

export default function SierpinskySettings({ setSize, setDepth, usecase }) {
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
          label="Size:"
          type="number"
          defaultValue={usecase?.size}
          id="size"
          step={10}
          onChange={(e) => setSize(Number(e.target.value))}
        />
      </div>
    </>
  );
}
