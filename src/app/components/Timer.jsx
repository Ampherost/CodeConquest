import { useState, useEffect } from "react";

export default function Timer({ initialTime, onExpire, hasUserSubmitted }) {
  //track of how many seconds are left on the timer
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // endTime is calculated once when the component mounts, based on the initial time
  // It's the exact future timestamp (in ms) when the timer should hit 0
  const [endTime] = useState(Date.now() + initialTime * 1000);

  useEffect(() => {
    // stop the timer early
    if (hasUserSubmitted) return;

    //calculate and update timeLeft every second
    const updateTimeLeft = () => {
      const remaining = Math.round((endTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);

      // Call onExpire callback when time runs out
      if (remaining <= 0 && onExpire)
     {
        onExpire();
      }
    };

    const interval = setInterval(updateTimeLeft, 1000);
    updateTimeLeft();

    // Clean up the interval when component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [endTime, onExpire, hasUserSubmitted]);

  // Helper function to convert seconds into MM:SS format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="text-2xl font-mono text-red-600 dark:text-red-400">
      ⏳ {formatTime(timeLeft)}
    </div>
  );
}
