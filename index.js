const { Pool } = require("pg");
const Cursor = require("pg-cursor");
// const { ingresar, consulta, consultaRut, actualizar, eliminar } = require('./querys') cambiar

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "holahola",
    database: "banco_db",
    port: 5432,
});

const argumentos = process.argv

const funcion = argumentos[2]
const registroTransaccion = argumentos[3]
const cuenta = argumentos[4]
const fecha = argumentos[5]
const descripcion = argumentos[6]
const monto = argumentos[7]


pool.connect(async (err, cliente, release) => {
    if (err) {
        return console.error(err.code)
    }
    if (registroTransaccion === 'nueva_transaccion') {
        await nuevaTransaccion(cliente)
    }
    if (registroTransaccion === 'transacciones') {
        await transacciones(cliente)
    }
    if (registroTransaccion === '10_registros') {
        await consultarRegistros(cliente)
    }
    if (registroTransaccion === 'saldo_cuenta') {
        await consultaSaldo(cliente)
    }
    release()
    pool.end()
})

//1. Crear una función asíncrona que registre una nueva transacción utilizando valores
//ingresados como argumentos en la línea de comando. Debe mostrar por consola la última transacción realizada.
const nuevaTransaccion = async (cliente) => {
    const operacion = {
        text: 'UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2',
        values: [monto, cuenta]

    }
    const registrar = {
        text: 'UPDATE transacciones (descripcion, fecha, monto, cuenta) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [descripcion, fecha, monto, cuenta]
    }
    try {
        await cliente.query('BEGIN')
        await cliente.query(operacion)
        console.log('Operacion realizada con éxito')
        const result = await cliente.query(registrar)
        await cliente.query('COMMIT')
        console.log('Operacion registrada correctamente')
    } catch (error) {
        await cliente.query('ROLLBACK')
        console.error(error)
    }
}
//2. Realizar una función asíncrona que consulte la tabla de transacciones y retorne
//máximo 10 registros de una cuenta en específico. Debes usar cursores para esto.
const consultarRegistros = async (cliente) => {

    const consulta = new Cursor("SELECT * FROM cuentas")
    const cursor = cliente.query(consulta);
    cursor.read(10, (err, rows) => {
        console.log(rows);
        cursor.close();

        cliente.query(resultado, (err, results) => {

            if (err) {
                console.error('ERROR')
            } else {
                console.log(results.rows)
            }
        })
    });
}

//--3. Realizar una función asíncrona que consulte el saldo de una cuenta y que sea
//ejecutada con valores ingresados como argumentos en la línea de comando. Debes usar cursores para esto.
const consultaSaldo= async (cliente) => {
    await cliente.query("BEGIN");
    //falta agregar cursor
    const descontar =
        "UPDATE usuarios SET saldo = saldo  WHERE id = 1 RETURNING * ";
    const descuento = await cliente.query(descontar);
    const acreditar =
        "UPDATE usuarios SET saldo = saldo  WHERE id =2 RETURNING * ";
    const acreditacion = await cliente.query(acreditar);
    console.log("Descuento realizado con éxito: ", descuento.rows[0]);
    console.log("Acreditación realizada con éxito: ",
        acreditacion.rows[0]);
    await cliente.query("COMMIT");

};
