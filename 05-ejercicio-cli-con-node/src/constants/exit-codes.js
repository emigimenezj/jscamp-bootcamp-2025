// Centraliza los códigos de salida para evitar números mágicos repartidos por el código. La idea es evitar tener valores de lógica perdidos por el código, en donde no existe referencia o contexto de que son o para que se usan. Por eso es buena idea generar un objeto de constante con los valores que necesitemos: de una manera más declarativa y centralizada.
export const EXIT_CODES = {
  OK: 0,
  APP: 1,
  USAGE: 2,
  SYSTEM: 3,
};
