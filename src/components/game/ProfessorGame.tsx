import React, { useState } from "react";
import { useProfessorGame } from "../../hooks/useProfessorGame";
import "./ProfessorGame.scss";

const ProfessorGame: React.FC = () => {
  const {
    numberOneFrom,
    numberOneTo,
    numberTwoFrom,
    numberTwoTo,
    testType,
    operations,
    pdfTasks,
    onlineTasks,
    sumUnitsGoesOverCurrentTenSum,
    sumExceedTwoDigitsSum,
    allowedNegativeResultsSub,
    allowedBiggerUnitsInSecondNumberSub,
    allowedThreeDigitsResultMul,
    setNumberOneFrom,
    setNumberOneTo,
    setNumberTwoFrom,
    setNumberTwoTo,
    setTestType,
    setSumUnitsGoesOverCurrentTenSum,
    setSumExceedTwoDigitsSum,
    setAllowedNegativeResultsSub,
    setAllowedBiggerUnitsInSecondNumberSub,
    setAllowedThreeDigitsResultMul,
    toggleOperation,
    handleCreateTasks,
    handleDownloadPDF,
  } = useProfessorGame();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="professor-game">
      <h5 className="alert alert-danger text-center">Generator zadataka</h5>
      
      <div className="game-container">
        <div className="game-config card p-4 shadow-sm">
          <h4 className="mb-3">Konfigurator generatora zadataka</h4>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Minimalna vrednost prvog broja</label>
              <input
                type="number"
                className="form-control"
                value={numberOneFrom}
                onChange={(e) => setNumberOneFrom(Number(e.target.value))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Maksimalna vrednost prvog broja</label>
              <input
                type="number"
                className="form-control"
                value={numberOneTo}
                onChange={(e) => setNumberOneTo(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Minimalna vrednost drugog broja</label>
              <input
                type="number"
                className="form-control"
                value={numberTwoFrom}
                onChange={(e) => setNumberTwoFrom(Number(e.target.value))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Maksimalna vrednost drugog broja</label>
              <input
                type="number"
                className="form-control"
                value={numberTwoTo}
                onChange={(e) => setNumberTwoTo(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Tip testa</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={testType === "online"}
                  onChange={() => setTestType("online")}
                />
                <label className="form-check-label">Online</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={testType === "pdf"}
                  onChange={() => setTestType("pdf")}
                />
                <label className="form-check-label">PDF</label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Operacije</label>
            <div className="d-flex gap-3">
              {["+", "-", "*", "/"].map((op) => (
                <div key={op} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={operations.includes(op)}
                    onChange={() => toggleOperation(op)}
                  />
                  <label className="form-check-label">{op}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <h5>Dodatne opcije</h5>
            <div className="options-grid">
              {operations.includes("+") && (
                <>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={sumUnitsGoesOverCurrentTenSum}
                      onChange={(e) => setSumUnitsGoesOverCurrentTenSum(e.target.checked)}
                    />
                    <label className="form-check-label">
                      Jedinice u zbiru prelaze trenutnu deseticu
                    </label>
                  </div>
                  
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={sumExceedTwoDigitsSum}
                      onChange={(e) => setSumExceedTwoDigitsSum(e.target.checked)}
                    />
                    <label className="form-check-label">
                      Zbir prelazi dve cifre
                    </label>
                  </div>
                </>
              )}

              {operations.includes("-") && (
                <>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={allowedNegativeResultsSub}
                      onChange={(e) => setAllowedNegativeResultsSub(e.target.checked)}
                    />
                    <label className="form-check-label">
                      Dozvoljeni negativni rezultati
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={allowedBiggerUnitsInSecondNumberSub}
                      onChange={(e) => setAllowedBiggerUnitsInSecondNumberSub(e.target.checked)}
                    />
                    <label className="form-check-label">
                      Dozvoljene veće jedinice u drugom broju
                    </label>
                  </div>
                </>
              )}

              {operations.includes("*") && (
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={allowedThreeDigitsResultMul}
                    onChange={(e) => setAllowedThreeDigitsResultMul(e.target.checked)}
                  />
                  <label className="form-check-label">
                    Rezultat može biti trocifren
                  </label>
                </div>
              )}
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={async (e) => {
              setIsLoading(true);
              await handleCreateTasks(e);
              setIsLoading(false);
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Generisanje...' : 'Generiši zadatke'}
          </button>
        </div>

        {testType === "pdf" && pdfTasks.length > 0 && (
          <div className="pdf-tasks card mt-4 p-4 shadow-sm">
            <h4 className="mb-3">PDF Zadaci</h4>
            <div className="tasks-grid">
              {pdfTasks.map((task, index) => (
                <div key={index} className="task-item">
                  {task}
                </div>
              ))}
            </div>
            <button className="btn btn-success mt-3" onClick={handleDownloadPDF}>
              Preuzmi PDF
            </button>
          </div>
        )}

        {testType === "online" && onlineTasks && onlineTasks.length > 0 && (
          <div className="online-tasks card mt-4 p-4 shadow-sm">
            <h4 className="mb-3">Online Zadaci ({onlineTasks.length})</h4>
            <div className="tasks-grid">
              {onlineTasks.map((task) => (
                <div key={task.taskId} className="task-item">
                  <span>{task.task}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorGame; 