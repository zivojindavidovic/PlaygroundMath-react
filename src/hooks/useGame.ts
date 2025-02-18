import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GameService } from '../services/gameService';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import {
  OnlineTask,
  Course,
  UnresolvedTest
} from '../types/game';

export const useGame = () => {
  const { accountId } = useParams<{ accountId: string }>();

  const [numberOneFrom, setNumberOneFrom] = useState<number>(1);
  const [numberOneTo, setNumberOneTo] = useState<number>(10);
  const [numberTwoFrom, setNumberTwoFrom] = useState<number>(1);
  const [numberTwoTo, setNumberTwoTo] = useState<number>(10);
  const [testType, setTestType] = useState<"online" | "pdf">("online");
  const [operations, setOperations] = useState<string[]>(["+"]); 
  const [pdfTasks, setPdfTasks] = useState<string[]>([]);
  const [onlineTasks, setOnlineTasks] = useState<OnlineTask[]>([]);
  const [onlineResponses, setOnlineResponses] = useState<Record<number, string>>({});

  const [sumUnitsGoesOverCurrentTenSum, setSumUnitsGoesOverCurrentTenSum] = useState<boolean>(false);
  const [sumExceedTwoDigitsSum, setSumExceedTwoDigitsSum] = useState<boolean>(false);
  const [allowedNegativeResultsSub, setAllowedNegativeResultsSub] = useState<boolean>(false);
  const [allowedBiggerUnitsInSecondNumberSub, setAllowedBiggerUnitsInSecondNumberSub] = useState<boolean>(false);
  const [allowedThreeDigitsResultMul, setAllowedThreeDigitsResultMul] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const [unresolvedTests, setUnresolvedTests] = useState<Record<number, UnresolvedTest[]>>({});
  const [unresolvedTestResponses, setUnresolvedTestResponses] = useState<Record<number, Record<number, string>>>({});

  useEffect(() => {
    if (!accountId) return;

    const fetchCourses = async () => {
      try {
        const data = await GameService.getCourses(accountId);
        setCourses(data);
      } catch (error) {
        toast.error('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, [accountId]);

  useEffect(() => {
    if (!accountId || courses.length === 0) return;

    courses.forEach((course) => {
      const fetchUnresolvedTests = async () => {
        try {
          const data = await GameService.getUnresolvedTests(accountId, course.courseId);
          if (data && data.length > 0) {
            setUnresolvedTests((prev) => ({
              ...prev,
              [course.courseId]: data[0].tests,
            }));
          }
        } catch (error) {
          console.error(`Error fetching unresolved tests for course ${course.courseId}:`, error);
        }
      };

      fetchUnresolvedTests();
    });
  }, [courses, accountId]);

  useEffect(() => {
    if (testType === "online") {
      const fetchOnlineTasks = async () => {
        if (!accountId) return;

        try {
          const data = await GameService.getUnresolvedTasks(accountId);
          if (data.success && data.results.length > 0) {
            const result = data.results[0];
            if (result.type === "online") {
              setOnlineTasks(result.tasks as OnlineTask[]);
              setOnlineResponses({});
            }
          }
        } catch (error) {
          toast.error('Failed to fetch online tasks');
        }
      };

      setPdfTasks([]);
      fetchOnlineTasks();
    } else {
      setOnlineTasks([]);
    }
  }, [testType, accountId]);

  const toggleOperation = (op: string) => {
    setOperations((prevOps) => {
      const newOps = prevOps.includes(op) 
        ? prevOps.filter((o) => o !== op)
        : [...prevOps, op];
      return newOps.length === 0 ? ["+"] : newOps;
    });
  };

  const handleCreateTasks = async () => {
    if (!accountId) return;

    try {
      const data = await GameService.generateTasks({
        numberOneFrom,
        numberOneTo,
        numberTwoFrom,
        numberTwoTo,
        testType,
        accountId: Number(accountId),
        operations,
        sumUnitsGoesOverCurrentTenSum,
        sumExceedTwoDigitsSum,
        allowedNegativeResultsSub,
        allowedBiggerUnitsInSecondNumberSub,
        allowedThreeDigitsResultMul,
      });

      if (data.success && data.results.length > 0) {
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
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  
    doc.text("Ime:", 20, 30);
    doc.line(35, 30, 120, 30);
  
    doc.text("Datum:", 140, 30);
    doc.line(160, 30, 190, 30);
  
    doc.setFontSize(14);
    doc.text("Zadaci:", doc.internal.pageSize.width / 2, 50, { align: "center" });
  
    const leftColumnX = 20;
    const rightColumnX = doc.internal.pageSize.width / 2 + 20;
    let currentY = 70;
    const lineHeight = 15;
  
    const leftTasks = pdfTasks.slice(0, Math.ceil(pdfTasks.length / 2));
    const rightTasks = pdfTasks.slice(Math.ceil(pdfTasks.length / 2));
  
    doc.setFontSize(12);
    leftTasks.forEach((task, index) => {
      doc.text(task, leftColumnX, currentY + index * lineHeight);
    });
  
    currentY = 70; 
    rightTasks.forEach((task, index) => {
      doc.text(task, rightColumnX, currentY + index * lineHeight);
    });
  
    doc.save(`tasks_${accountId}.pdf`);
  };

  const handleSubmitOnlineTasks = async () => {
    if (!accountId) return;

    try {
      const answersObject: Record<string, string> = {};
      Object.keys(onlineResponses).forEach((key) => {
        answersObject[key] = onlineResponses[parseInt(key, 10)];
      });

      const data = await GameService.solveTasks({
        testAnswers: [answersObject],
        accountId: Number(accountId),
      });

      toast.success(`You won ${data.pointsFromTest} points from this test!`);
    } catch (error) {
      toast.error('Failed to submit tasks');
    }
  };

  const handleTestResponseChange = (testId: number, taskId: number, value: string) => {
    setUnresolvedTestResponses((prev) => {
      const testResponses = prev[testId] || {};
      return {
        ...prev,
        [testId]: {
          ...testResponses,
          [taskId]: value,
        },
      };
    });
  };

  const handleSubmitUnresolvedTest = async (testId: number) => {
    if (!accountId) return;

    const testAnswers = unresolvedTestResponses[testId] || {};

    try {
      const data = await GameService.solveTasks({
        testAnswers: [testAnswers],
        accountId: Number(accountId),
      });

      toast.success(`You won ${data.pointsFromTest} points from this test!`);
    } catch (error) {
      toast.error('Failed to submit test');
    }
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
    onlineResponses,
    sumUnitsGoesOverCurrentTenSum,
    sumExceedTwoDigitsSum,
    allowedNegativeResultsSub,
    allowedBiggerUnitsInSecondNumberSub,
    allowedThreeDigitsResultMul,
    courses,
    unresolvedTests,
    unresolvedTestResponses,
    setNumberOneFrom,
    setNumberOneTo,
    setNumberTwoFrom,
    setNumberTwoTo,
    setTestType,
    setOnlineResponses,
    setSumUnitsGoesOverCurrentTenSum,
    setSumExceedTwoDigitsSum,
    setAllowedNegativeResultsSub,
    setAllowedBiggerUnitsInSecondNumberSub,
    setAllowedThreeDigitsResultMul,
    toggleOperation,
    handleCreateTasks,
    handleDownloadPDF,
    handleSubmitOnlineTasks,
    handleTestResponseChange,
    handleSubmitUnresolvedTest,
  };
}; 