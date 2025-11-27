import { EXCHANGES, ROUTING_KEYS } from "../../infra/sqs/messaging/rabbitmq/rabbitmq.const"
import { getChannel } from "../../infra/sqs/sqsClient"


export async function publishEmployeeCreated(employee: any) {
  const ch = getChannel()
  const payload = Buffer.from(JSON.stringify(employee))

  ch.publish(EXCHANGES.EMPLOYEES, ROUTING_KEYS.EMPLOYEE_CREATED, payload, {
    persistent: true,
    contentType: 'application/json',
  })

  console.log('[Producer] employee.created publicado para', employee.email)
}
