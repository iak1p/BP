import SettingsInput from "../SettingsInput";

export default function AnkletSettings({
  defaultParams,
  updateFractalParam,
  index,
}) {
  return (
    <>
      <h3 className="title">Anklet fractal settings</h3>
      <div className="canvas-settings">
        <SettingsInput
          label="Depth:"
          type="number"
          defaultValue={defaultParams?.depth}
          id="depth"
          minValue={1}
          onChange={(e) =>
            updateFractalParam(index, "depth", Number(e.target.value))
          }
        />

        <SettingsInput
          label="Line size:"
          type="number"
          defaultValue={defaultParams?.lineLength}
          id="lineLength"
          onChange={(e) =>
            updateFractalParam(index, "lineLength", Number(e.target.value))
          }
        />

        <SettingsInput
          label="Square size:"
          type="number"
          defaultValue={defaultParams?.squareSide}
          id="squareSide"
          onChange={(e) =>
            updateFractalParam(index, "squareSide", Number(e.target.value))
          }
        />
      </div>
    </>
  );
}
