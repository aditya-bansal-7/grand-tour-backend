import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const workflow = await prisma.workflow.findFirst()
  console.log(JSON.stringify(workflow, null, 2))
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
