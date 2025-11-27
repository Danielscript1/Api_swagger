import { setupQueues } from "../../infra/sqs/messaging/rabbitmq/queueSetup"
import { QUEUES } from "../../infra/sqs/messaging/rabbitmq/rabbitmq.const"
import { connectRabbit, getChannel } from "../../infra/sqs/sqsClient"



async function sendWelcomeEmail(employee: any) {

  console.log(`[E-MAIL] Enviando boas-vindas para ${employee.email}`)

}


async function startEmployeesConsumer() {
  await connectRabbit()
  await setupQueues()

  const ch = getChannel()

  await ch.consume(QUEUES.EMPLOYEES, async (msg: { content: { toString: () => string } }) => {
    if (!msg) return

    try {
      const employee = JSON.parse(msg.content.toString())
      console.log('[Consumer] Processando novo funcionário:', employee.email)

      
      await sendWelcomeEmail(employee)

  
      ch.ack(msg)
    } catch (err) {
      console.error('[Consumer] Erro ao processar funcionário. Vai para DLQ:', err)
      ch.nack(msg, false, false) 
    }
  })

  console.log('[Consumer] Escutando employees-queue...')
}

startEmployeesConsumer().catch((err) => {
  console.error('Erro ao iniciar employees-consumer:', err)
  process.exit(1)
})
