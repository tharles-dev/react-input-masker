import React, { forwardRef, InputHTMLAttributes, ElementType } from "react";

export interface MaskedInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  mask?: string | string[];
  formatter?: (raw: string) => string;
  as?: ElementType;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    { mask, formatter, as: Component = "input", value = "", onChange, ...rest },
    ref
  ) => {
    const formatValue = (raw: string) => {
      let formattedValue = raw;

      if (formatter) {
        formattedValue = formatter(raw);
      } else if (mask) {
        if (typeof mask === "string") {
          const digits = raw.replace(/\D/g, "");
          formattedValue = applyGenericMask(digits, mask);
        } else if (Array.isArray(mask)) {
          formattedValue = formatNumeric(raw);
        }
      }
      return formattedValue;
    };

    const displayValue = formatValue(String(value));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const formatted = formatValue(raw);

      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, value: formatted },
        });
      }
    };

    return (
      <Component
        ref={ref}
        {...rest}
        value={displayValue}
        onChange={handleChange}
      />
    );
  }
);

// Função de máscara genérica: substitui '#' pelos dígitos
function applyGenericMask(value: string, mask: string): string {
  let result = "";
  let valueIndex = 0;
  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    result += mask[i] === "#" ? value[valueIndex++] : mask[i];
  }
  return result;
}

// Formatação numérica simples
function formatNumeric(value: string): string {
  const raw = value.replace(/\D/g, "");
  if (raw.length === 0) return "";
  if (raw.length === 1) return raw;
  if (raw.length <= 3) {
    const intPart = raw[0];
    const decPart = raw.slice(1);
    return decPart ? `${intPart}.${decPart}` : intPart;
  }
  const intPart = raw.slice(0, 2);
  const decPart = raw.slice(2, 4);
  return `${intPart}.${decPart}`;
}
