import React, {
  useState,
  forwardRef,
  InputHTMLAttributes,
  ElementType,
} from "react";

export interface MaskedInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  mask?: string | string[];
  formatter?: (raw: string) => string;
  as?: ElementType;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, formatter, as: Component = "input", onChange, ...rest }, ref) => {
    const [value, setValue] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      let formattedValue = raw;

      if (formatter) {
        // Formatter customizado tem prioridade
        formattedValue = formatter(raw);
      } else if (mask) {
        // Se a máscara for uma string, aplica máscara genérica (ex: CPF)
        if (typeof mask === "string") {
          const digits = raw.replace(/\D/g, "");
          formattedValue = applyGenericMask(digits, mask);
        }
        // Se for array, aplica formatação numérica simples
        else if (Array.isArray(mask)) {
          formattedValue = formatNumeric(raw);
        }
      }

      setValue(formattedValue);

      if (onChange) {
        // Propaga o evento com o valor formatado
        onChange({
          ...e,
          target: { ...e.target, value: formattedValue },
        });
      }
    };

    return (
      <Component ref={ref} {...rest} value={value} onChange={handleChange} />
    );
  }
);

// Aplica máscara genérica onde '#' representa um dígito.
// Exemplo: mask "###.###.###-##" e valor "12345678901" gera "123.456.789-01"
function applyGenericMask(value: string, mask: string): string {
  let result = "";
  let valueIndex = 0;
  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    if (mask[i] === "#") {
      result += value[valueIndex++];
    } else {
      result += mask[i];
    }
  }
  return result;
}

// Formatação numérica simples para duas máscaras:
// - Se o valor tiver até 3 dígitos, aplica a máscara "#.##"
// - Se tiver 4 ou mais dígitos, usa "##.##"
// Exemplos:
// "5"    → "5"
// "55"   → "5.5"
// "555"  → "5.55"
// "5555" → "55.55"
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
