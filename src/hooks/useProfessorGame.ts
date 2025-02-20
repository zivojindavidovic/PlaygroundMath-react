import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameService } from '../services/gameService';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import { OnlineTask } from '../types/game';

export const useProfessorGame = () => {
  const { courseId } = useParams<{ courseId: string }>();
  
  const [numberOneFrom, setNumberOneFrom] = useState<number>(1);
  const [numberOneTo, setNumberOneTo] = useState<number>(10);
  const [numberTwoFrom, setNumberTwoFrom] = useState<number>(1);
  const [numberTwoTo, setNumberTwoTo] = useState<number>(10);
  const [testType, setTestType] = useState<"online" | "pdf">("online");
  const [operations, setOperations] = useState<string[]>(["+"]); 
  const [pdfTasks, setPdfTasks] = useState<string[]>([]);
  const [onlineTasks, setOnlineTasks] = useState<OnlineTask[]>([]);

  const [sumUnitsGoesOverCurrentTenSum, setSumUnitsGoesOverCurrentTenSum] = useState<boolean>(false);
  const [sumExceedTwoDigitsSum, setSumExceedTwoDigitsSum] = useState<boolean>(false);
  const [allowedNegativeResultsSub, setAllowedNegativeResultsSub] = useState<boolean>(false);
  const [allowedBiggerUnitsInSecondNumberSub, setAllowedBiggerUnitsInSecondNumberSub] = useState<boolean>(false);
  const [allowedThreeDigitsResultMul, setAllowedThreeDigitsResultMul] = useState<boolean>(false);

  const toggleOperation = (op: string) => {
    setOperations((prevOps) => {
      const newOps = prevOps.includes(op) 
        ? prevOps.filter((o) => o !== op)
        : [...prevOps, op];
      return newOps.length === 0 ? ["+"] : newOps;
    });
  };

  const handleCreateTasks = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!courseId) return;

    try {
      const data = await GameService.generateTasksForCourse({
        numberOneFrom,
        numberOneTo,
        numberTwoFrom,
        numberTwoTo,
        testType,
        courseId: Number(courseId),
        operations,
        sumUnitsGoesOverCurrentTenSum,
        sumExceedTwoDigitsSum,
        allowedNegativeResultsSub,
        allowedBiggerUnitsInSecondNumberSub,
        allowedThreeDigitsResultMul
      });

      if (data.success && data.results && data.results.length > 0) {
        const result = data.results[0];
        if (result.type === "pdf") {
          setPdfTasks(result.tasks as string[]);
        } else if (result.type === "online") {
          setOnlineTasks(result.tasks as OnlineTask[]);
        }
      }
    } catch (error) {
      toast.error('Failed to create tasks');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text("Ime:", 10, 20);
    doc.line(25, 20, 90, 20);
    doc.text("Datum:", 140, 20);
    doc.line(160, 20, 190, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Zadaci:", 90, 40);

    const leftTasks = pdfTasks.slice(0, 10);
    const rightTasks = pdfTasks.slice(10, 20);

    doc.setFontSize(12);
    leftTasks.forEach((task, index) => {
      doc.text(task, 20, 60 + index * 10);
    });
    rightTasks.forEach((task, index) => {
      doc.text(task, 110, 60 + index * 10);
    });

    doc.save(`tasks_course_${courseId}.pdf`);
  };

  return {
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
  };
};