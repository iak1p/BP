import { useState } from "react";

export default function RotateUseCase({ setUseCaseRotation }) {
  const [rotationUsecase, setRotationUsecase] = useState(false);
  return (
    <>
      <div className="usecase-div">
        <div className="usecase-div__item">
          <label htmlFor="rotationUsecase">Set rotation</label>
          <input
            id="rotationUsecase"
            type="checkbox"
            onChange={(e) => {
              setRotationUsecase(!rotationUsecase);
              rotationUsecase && setUseCaseRotation(null);
              !rotationUsecase &&
                setUseCaseRotation({ name: "rotate", angle: 0 });
            }}
          />
        </div>

        <input
          id="rotationUsecase"
          type="number"
          disabled={!rotationUsecase}
          defaultValue={0}
          onBlur={(e) => {
            if (rotationUsecase)
              setUseCaseRotation({ name: "rotate", angle: e.target.value });
          }}
        />
      </div>
    </>
  );
}
