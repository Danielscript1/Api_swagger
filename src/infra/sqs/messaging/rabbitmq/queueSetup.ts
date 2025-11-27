import { EXCHANGES, QUEUES, ROUTING_KEYS } from "./rabbitmq.const"
import { getChannel } from "../../sqsClient"


export async function setupQueues() {
  const ch = getChannel()

  await ch.assertExchange(EXCHANGES.EMPLOYEES, 'direct', { durable: true })
  await ch.assertExchange(EXCHANGES.EMPLOYEES_DLX, 'direct', { durable: true })

  await ch.assertQueue(QUEUES.EMPLOYEES, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': EXCHANGES.EMPLOYEES_DLX,
      'x-dead-letter-routing-key': ROUTING_KEYS.EMPLOYEE_DLQ,
    },
  })

  await ch.assertQueue(QUEUES.EMPLOYEES_DLQ, { durable: true })

  await ch.bindQueue(QUEUES.EMPLOYEES, EXCHANGES.EMPLOYEES, ROUTING_KEYS.EMPLOYEE_CREATED)
  await ch.bindQueue(QUEUES.EMPLOYEES_DLQ, EXCHANGES.EMPLOYEES_DLX, ROUTING_KEYS.EMPLOYEE_DLQ)

  console.log('[RabbitMQ] employees exchange/queues configuradas')
}
