import RotateUseCase from "./usecases/RotateUseCase";
import ColorSolidUseCase from "./usecases/ColorSolidUseCase";
import ScaleUseCase from "./usecases/ScaleUseCase";
import LineWidthUseCase from "./usecases/LineWidthUseCase";
import { useEffect, useState } from "react";

export default function Usecases({
  setUseCaseColor,
  setUseCaseScale,
  setUseCaseRotation,
  setUseCaseThick,
}) {
  const [usecases, setUsecases] = useState([]);

  const useCaseComponents = {
    colorSolid: (u) => (
      <ColorSolidUseCase setUseCaseColor={setUseCaseColor} key={u.id} />
    ),
    scale: (u) => <ScaleUseCase setUseCaseScale={setUseCaseScale} key={u.id} />,
    rotate: (u) => (
      <RotateUseCase setUseCaseRotation={setUseCaseRotation} key={u.id} />
    ),
    width: (u) => (
      <LineWidthUseCase setUseCaseThick={setUseCaseThick} key={u.id} />
    ),
  };

  useEffect(() => {
    fetch("http://localhost:4003/api/usecases/")
      .then((res) => res.json())
      .then((data) => {
        setUsecases(data);
      });
  }, []);
  return (
    <>
      <h3 className="title">Usecases</h3>
      <div className="canvas-settings">
        {usecases.map((u) => {
          const renderUseCase = useCaseComponents[u.name];
          return renderUseCase ? renderUseCase(u) : null;
        })}
      </div>
    </>
  );
}
