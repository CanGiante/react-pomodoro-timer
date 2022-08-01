import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  /*******************
   *   Setup timer   *
   ******************/
  const initialSession = 25;
  const [session, setSession] = useState(initialSession);

  const initialPause = 5;
  const [pause, setPause] = useState(initialPause);

  const oneMinute = 60;
  const initialCount = initialSession * oneMinute;
  const [count, setCount] = useState(initialCount);

  /******************
   *   Beep sound   *
   *****************/
  const beep = useRef(null);
  let sound =
    "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

  /********************
   *  Handle session  *
   *******************/
  const handleSessionLength = (e) => {
    if (isRunning === false) {
      switch (e.target.value) {
        case "+":
          if (session < 60) {
            setSession(session + 1);
            if (breakTime) {
              setCount((session + 1) * oneMinute);
            }
          }
          break;
        case "-":
          if (session > 1) {
            setSession(session - 1);
            if (breakTime) {
              setCount((session - 1) * oneMinute);
            }
          }
          break;
        default:
          return;
      }
    }
  };

  /********************
   *   Handle break   *
   *******************/
  let initialBreakTime = true;
  const [breakTime, setBreakTime] = useState(initialBreakTime);
  const handleBreakLength = (e) => {
    if (isRunning === false) {
      switch (e.target.value) {
        case "+":
          if (pause < 60) {
            setPause(pause + 1);
            if (!breakTime) {
              setCount((pause + 1) * oneMinute);
            }
          }
          break;
        case "-":
          if (pause > 1) {
            setPause(pause - 1);
            if (!breakTime) {
              setCount((pause - 1) * oneMinute);
            }
          }
          break;
        default:
          return;
      }
    }
  };

  /******************
   *   Handle run   *
   *****************/
  const [isRunning, setIsRunning] = useState(false);
  const handleIsRunningClick = (e) => {
    return setIsRunning(!isRunning);
  };
  useInterval(
    () => {
      if (count < 1) {
        beep.current.play();

        switch (breakTime) {
          case false:
            setCount(session * oneMinute);
            setBreakTime(true);
            break;

          case true:
            setCount(pause * oneMinute);
            setBreakTime(false);
            break;
          default:
          // do nothing
        }
      } else {
        setCount(count - 1);
      }
    },
    isRunning ? 1000 : null
  );

  /**************
   *   Reset    *
   *************/
  const reset = (e) => {
    setCount(initialCount);
    setSession(initialSession);
    setPause(initialPause);
    setIsRunning(false);
    setBreakTime(initialBreakTime);
    beep.current.pause();
    beep.current.currentTime = 0;
  };

  /*******************
   *   Format time   *
   ******************/
  let timer;
  const minutes = countInMinutes(count);
  const seconds = countInSeconds(count);
  if (minutes === 0 && session > 59) {
    timer = `6${minutes}:${seconds}`;
  } else if (minutes < 10) {
    timer = `0${minutes}:${seconds}`;
  } else {
    timer = `${minutes}:${seconds}`;
  }

  // console.log(`
  //   pause: ${pause}
  //   session: ${session}
  //   count: ${count}
  //   break: ${!breakTime}
  // `);

  return (
    <div className="h-screen">
      <div className="h-full mx-auto max-w-lg flex flex-col justify-center content-center bg-[url('pomodoro.png')] bg-no-repeat bg-center">
        <div className="container flex justify-around">
          <div className="flex">
            {/* <span id="break-label">Break Length</span>
            <br /> */}
            <button
              className="rounded-full border-orange-300 border-2"
              id="break-decrement"
              onClick={handleBreakLength}
              value="-"
            >
              -
            </button>
            <span id="break-length">{pause}</span>
            <button
              className="rounded-full border-orange-300 border-2"
              id="break-increment"
              onClick={handleBreakLength}
              value="+"
            >
              +
            </button>
          </div>
          <div>
            {/* <span id="session-label">Session Length</span>
            <br /> */}
            <button
              className="rounded-full border-orange-300 border-2"
              id="session-decrement"
              onClick={handleSessionLength}
              value="-"
            >
              -
            </button>
            <span id="session-length">{session}</span>
            <button
              className="rounded-full border-orange-300 border-2"
              id="session-increment"
              onClick={handleSessionLength}
              value="+"
            >
              +
            </button>
          </div>
        </div>

        <div className="container flex justify-center">
          <div className="flex flex-wrap">
            <div className="flex basis-full">
              <span id="timer-label">{breakTime ? "Session" : "Break"}</span>
            </div>{" "}
            <div className="basis-full flex justify-center">
              <button
                className="rounded-full border-orange-300 border-2"
                id="start_stop"
                onClick={handleIsRunningClick}
              >
                &gt; / ||
              </button>
              <span id="time-left">{timer}</span>
              <button
                className="rounded-full border-orange-300 border-2"
                id="reset"
                onClick={reset}
              >
                reset
              </button>
            </div>
          </div>
        </div>

        <audio id="beep" ref={beep} src={sound} />
      </div>
    </div>
  );
}

export default App;


/**************
 *   Helpers   *
 **************/
function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
function countInSeconds(a) {
  a = Number(a);
  const s = Math.floor((a % 3600) % 60);
  return ("0" + s).slice(-2);
}
function countInMinutes(a) {
  a = Number(a);
  const m = Math.floor((a % 3600) / 60);
  return m;
}