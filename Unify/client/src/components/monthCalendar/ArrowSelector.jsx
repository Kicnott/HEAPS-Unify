import React from 'react'
import '../../styles/DropdownList.css';

export const ArrowSelector = ({ optionArray, onChange, value }) => {
  const currentIndex = optionArray.findIndex(option => option.value === value);

  const goPrev = () => {
    if (currentIndex > 0) {
      onChange({ target: { value: optionArray[currentIndex - 1].value } });
    }
  };

  const goNext = () => {
    if (currentIndex < optionArray.length - 1) {
      onChange({ target: { value: optionArray[currentIndex + 1].value } });
    }
  };

  const displayLabel =
    currentIndex !== -1
      ? optionArray[currentIndex].label
      : optionArray[0]?.label || "";

  return (
    <div className="arrow-selector" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        onClick={goPrev}
        disabled={currentIndex <= 0}
        aria-label="Previous"
        style={{ cursor: currentIndex <= 0 ? "not-allowed" : "pointer" }}
      >
        &#8592;
      </button>
      <span>{displayLabel}</span>
      <button
        onClick={goNext}
        disabled={currentIndex >= optionArray.length - 1}
        aria-label="Next"
        style={{ cursor: currentIndex >= optionArray.length - 1 ? "not-allowed" : "pointer" }}
      >
        &#8594;
      </button>
    </div>
  );
};
