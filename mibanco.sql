CREATE DATABASE banco_db;
--c\ banco_db;
CREATE TABLE transacciones (descripcion varchar(50), fecha varchar(10), monto DECIMAL, cuenta INT);

CREATE TABLE cuentas (id INT, saldo DECIMAL CHECK (saldo >= 0) );

INSERT INTO cuentas values (1, 20000);

--1. Crear una función asíncrona que registre una nueva transacción utilizando valores
--ingresados como argumentos en la línea de comando. Debe mostrar por consola la última transacción realizada.

--2. Realizar una función asíncrona que consulte la tabla de transacciones y retorne
--máximo 10 registros de una cuenta en específico. Debes usar cursores para esto.

--3. Realizar una función asíncrona que consulte el saldo de una cuenta y que sea
--ejecutada con valores ingresados como argumentos en la línea de comando. Debes usar cursores para esto.

--4. En caso de haber un error en la transacción, se debe retornar el error por consola.