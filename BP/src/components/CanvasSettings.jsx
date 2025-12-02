export default function CanvasSettings({ canvasSize, setCanvasSize }) {
  return (
    <>
      <h3 className="title">Canvas settings</h3>
      <div className="canvas-settings">
        <div className="">
          <label htmlFor="size">Canvas size x:</label>
          <input
            id="size"
            type="number"
            step={10}
            defaultValue={800}
            value={canvasSize.x}
            onChange={(e) =>
              setCanvasSize({ ...canvasSize, x: Number(e.target.value) })
            }
            onBlur={(e) => {
              const val = Number(e.target.value);
              const rounded = Math.round(val / 10) * 10;
              setCanvasSize({ ...canvasSize, x: rounded });
            }}
          />
        </div>
        <div>
          <label htmlFor="size">Canvas size y:</label>
          <input
            id="size"
            type="number"
            step={10}
            defaultValue={600}
            value={canvasSize.y}
            onChange={(e) =>
              setCanvasSize({ ...canvasSize, y: Number(e.target.value) })
            }
            onBlur={(e) => {
              const val = Number(e.target.value);
              const rounded = Math.round(val / 10) * 10;
              setCanvasSize({ ...canvasSize, y: rounded });
            }}
          />
        </div>
      </div>
    </>
  );
}
