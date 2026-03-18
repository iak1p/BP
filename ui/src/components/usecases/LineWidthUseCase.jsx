import { useState } from "react";

export default function LineWidthUseCase({ setUseCaseThick }) {
  const [thicknessUsecase, setThicknessUsecase] = useState(false);
  return (
    <>
      <div className="usecase-div">
        <div className="usecase-div__item">
          <label htmlFor="rotationUsecase">Set line thickness</label>
          <input
            id="rotationUsecase"
            type="checkbox"
            onChange={(e) => {
              setThicknessUsecase(!thicknessUsecase);
              thicknessUsecase && setUseCaseThick(null);
              !thicknessUsecase &&
                setUseCaseThick({
                  name: "width",
                  width: 1,
                });
            }}
          />
        </div>

        <input
          id="rotationUsecase"
          type="number"
          step={0.1}
          disabled={!thicknessUsecase}
          defaultValue={1}
          onBlur={(e) => {
            if (thicknessUsecase)
              setUseCaseThick({
                name: "width",
                width: Number(e.target.value),
              });
          }}
        />
      </div>
    </>
  );
}
