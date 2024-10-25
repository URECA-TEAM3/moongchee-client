import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const index = () => {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <div>
      {step === 1 && <Step1 handleNextStep={handleNextStep}></Step1>}
      {step === 2 && <Step2 handleNextStep={handleNextStep}></Step2>}
      {step === 3 && <Step3 handleNextStep={handleNextStep}></Step3>}
    </div>
  );
};

export default index;
