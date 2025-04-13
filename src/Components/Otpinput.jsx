import React, { useEffect, useState } from 'react';
import './styles.css';

/**
 * OTP Input Component
 *
 * This component provides a user interface for entering One-Time Passwords (OTPs).
 * It supports the following functionalities:
 *
 * 1. Forward Functionality:
 * i. When no digit is in the current input field:
 * - Apply the newly entered digit to the current input.
 * - Focus the immediate next input field.
 * ii. When the current input field contains a digit:
 * a. If the cursor is at the beginning of the input:
 * - Apply the new digit to the current input.
 * - Slide the current digit (older value) to the immediate right input field, if available.
 * b. If the cursor is at the end of the input:
 * - Apply the new digit to the next input field, if available.
 * - Focus on the next input field.
 *
 * 2. Backward Functionality:
 * - Pressing the Backspace key in an empty input field will move the focus to the previous input field.
 * - Pressing the Backspace key in a non-empty input field will clear the current input.
 *
 * 3. Arrows Functionality:
 * - Pressing the Right Arrow key will move the focus to the next input field.
 * - Pressing the Left Arrow key will move the focus to the previous input field.
 *
 */
const Otpinput = ({ size = 6, onsubmit }) => {
  const [inputValues, setInputValues] = useState(() => {
    return new Array(size).fill("");
  });

  const focusNext = (currentInput) => {
    currentInput?.nextElementSibling?.focus();
  };

  const focusPrevious = (currentInput) => {
    currentInput?.previousElementSibling?.focus();
  };

  const focusNextToNext = (currentInput) => {
    if ((currentInput?.nextElementSibling?.nextElementSibling)) {
      currentInput.nextElementSibling.nextElementSibling.focus();
    } else {
      focusNext(currentInput);
    }
  };

  const handleNumericinput = (event) => {
    const inputValue = Number(event.key);
    if (isNaN(inputValue)) return;

    const inputElement = event.target;

    const inputIndex = Number(inputElement.id);
    if (inputValues[inputIndex].length === 0) {
      //no digit present in the  input
      setInputValues((prev) => {
        const newValues = [...prev];
        newValues[inputIndex] = inputValue.toString();
        return newValues;
      });
      focusNext(inputElement);
    } else {
      //When there is a digit
      const cursorIndex = inputElement.selectionStart;
      if (cursorIndex === 0) {
        setInputValues((prev) => {
          const newValues = [...prev];
          if (inputIndex < size - 1) {
            newValues[inputIndex + 1] = prev[inputIndex];
          }
          newValues[inputIndex] = inputValue.toString();
          return newValues;
        });

        focusNextToNext(inputElement);
      } else if (inputIndex + 1 < size) {
        setInputValues(prev => {
          const newValues = [...prev];
          newValues[inputIndex + 1] = inputValue;
          return newValues;
        });
        focusNextToNext(inputElement);
      }
    }
  };

  const handleBackSpace = (event) => {
    if (event.key === "Backspace") {
      const inputIndex = Number(event.target.id);
      setInputValues(prev => {
        const newValues = [...prev];
        newValues[inputIndex] = "";
        return newValues;
      })
      focusPrevious(event.target);
    }
  }
  const handleArrows = (event) => {
    if (event.key === "ArrowRight") {
      focusNext(event.target);
    } else if (event.key === "ArrowLeft") {
      focusPrevious(event.target);
    }
  }

  const onKeyUp = (event) => {
    handleNumericinput(event);
    handleBackSpace(event);
    handleArrows(event);
  };

  useEffect(() => {
    console.log("Effect");
    let isvalid = true;
    inputValues.forEach(inputValue => {
      if (inputValue.length === 0) isvalid = false;
    })
    isvalid && onsubmit(inputValues);

  }, [inputValues, onsubmit])
  console.log(inputValues);
  return (
    <div className='container'>
        <h2>Enter Your OTP Here:</h2>
      <div className='otp-input-container'>
        {
          inputValues.map((inputValue, index) => {
            return <input
              id={index.toString()}
              key={index.toString()}
              value={inputValue}
              onKeyUp={onKeyUp}
              maxLength={1}
            />
          })
        }

      </div>
    </div>
  )
}

export default Otpinput;