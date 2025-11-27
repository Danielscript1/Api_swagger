import amqp from 'amqplib'

let channel:any

export async function connectRabbit() {
  const connection = await amqp.connect('amqp://localhost')
  channel = await connection.createChannel()
  console.log('[RabbitMQ] conectado')
}

export function getChannel() {
  return channel
}

