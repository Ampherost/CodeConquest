// utils/Timer.js
export class QuizTimer 
{
  
  constructor(duration, startTime) 
  {
    this.duration = this.parseDuration(duration); // "HH:MM:SS" 
    this.startTime = startTime ? new Date(startTime).getTime() : null; //2025-05-30 22:07:06.425+00
  }

  // Convert "HH:MM:SS"  
  parseDuration(duration) 
  {
    if (typeof duration === 'number') return duration;

    if (typeof duration === 'string') 
    {
      const parts = duration.split(':').map(Number); // "HH:MM:SS"
      if (parts.length === 3) 
     {
        const [hours, minutes, seconds] = parts;
        return ((hours * 60 + minutes) * 60 + seconds) * 1000;
      }
    }
    return 0; 
  }

  getRemainingTime() 
  {
    if (!this.startTime || !this.duration) return 0;
    const elapsed = Date.now() - this.startTime;
    return Math.max(this.duration - elapsed, 0);
  }

  isExpired() {
    return this.getRemainingTime() <= 0;
  }

  getFormattedTimeLeft() {
    const totalMs = this.getRemainingTime();
    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

export default QuizTimer;
