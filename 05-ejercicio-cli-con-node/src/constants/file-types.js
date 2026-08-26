// 0o111 es la máscara octal de los bits de ejecución para usuario, grupo y otros. Esto como lo estamos usando en varios lados es mejor pasarlo a una variable. Además es un valor fácil de equivocarse y/o olvidarlo. Es mejor tenerlo en una constante.
export const EXEC_PERMISSION_MASK = 0o111;
