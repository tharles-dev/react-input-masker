import React from "react"; // Adicione essa linha
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MaskedInput } from "../components/MaskedInput";

describe("MaskedInput", () => {
  it("deve renderizar o input com placeholder", () => {
    const { getByPlaceholderText } = render(
      <MaskedInput placeholder="Teste Input" />
    );
    const input = getByPlaceholderText("Teste Input");
    expect(input).toBeInTheDocument();
  });

  it("deve aplicar máscara genérica (não numérica) para CPF", () => {
    const { getByPlaceholderText } = render(
      <MaskedInput mask="###.###.###-##" placeholder="CPF" />
    );
    const input = getByPlaceholderText("CPF") as HTMLInputElement;
    // Simula a digitação: "12345678901"
    fireEvent.change(input, { target: { value: "12345678901" } });
    // Espera "123.456.789-01"
    expect(input.value).toBe("123.456.789-01");
  });

  it("deve aplicar formatação para máscara numérica com array", () => {
    const { getByPlaceholderText } = render(
      <MaskedInput mask={["#.##", "##.##"]} placeholder="Preço" />
    );
    const input = getByPlaceholderText("Preço") as HTMLInputElement;

    // Cenário: digitando "5"
    fireEvent.change(input, { target: { value: "5" } });
    expect(input.value).toBe("5");

    // Cenário: digitando "55" → com máscara '#.##' deve exibir "5.5"
    fireEvent.change(input, { target: { value: "55" } });
    expect(input.value).toBe("5.5");

    // Cenário: digitando "555" → deve exibir "5.55"
    fireEvent.change(input, { target: { value: "555" } });
    expect(input.value).toBe("5.55");

    // Cenário: digitando "5555" → usa "##.##", resultando em "55.55"
    fireEvent.change(input, { target: { value: "5555" } });
    expect(input.value).toBe("55.55");
  });

  it("deve utilizar formatter customizado se fornecido", () => {
    const customFormatter = (raw: string) => `Formatted: ${raw}`;
    const { getByPlaceholderText } = render(
      <MaskedInput formatter={customFormatter} placeholder="Custom" />
    );
    const input = getByPlaceholderText("Custom") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12345" } });
    expect(input.value).toBe("Formatted: 12345");
  });

  it('deve renderizar componente customizado via prop "as"', () => {
    // Cria um componente dummy para testar a prop "as"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomComponent = (props: any) => (
      <input data-testid="custom-input" {...props} />
    );
    const { getByTestId } = render(
      <MaskedInput as={CustomComponent} placeholder="Custom As" />
    );
    const customInput = getByTestId("custom-input");
    expect(customInput).toBeInTheDocument();
  });
});
